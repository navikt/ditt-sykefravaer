import { QueryClient, skipToken, useQuery, useQueryClient } from '@tanstack/react-query'

import { LinemanagerResponse, NarmesteLeder, tilNarmesteLeder } from '../types/narmesteLeder'
import { fetchJsonMedRequestId } from '../utils/fetch'
import { isMockBackend } from '../utils/environment'

import { UseTestpersonQuery } from './useTestpersonQuery'

const cacheTestperson = (testperson: string) => (isMockBackend() ? testperson || '?testperson=default' : '')
export const narmesteledereKey = (testperson: string) => ['narmesteledere', cacheTestperson(testperson)] as const
const avkreftedeKey = (testperson: string) => ['avkreftede-narmesteledere', cacheTestperson(testperson)] as const
type Avkreftet = { versjon: symbol; forsok: number; orgnummer?: string }
type Avkreftede = Record<string, Avkreftet>
const MAKS_OPPFOLGINGER = 3
const OPPFOLGINGSINTERVALL_MS = 2000

class OppfolgingFeil extends Error {
    constructor(cause: unknown) {
        super(cause instanceof Error ? cause.message : 'Henting av nærmeste ledere feilet', { cause })
    }
}

export function registrerAvkreftetLeder(queryClient: QueryClient, testperson: string, id: string, orgnummer?: string) {
    const key = avkreftedeKey(testperson)
    // Beskyttelsen må overleve at komponenten forsvinner og query-cachen ellers ryddes.
    queryClient.setQueryDefaults(key, { gcTime: Infinity })
    queryClient.setQueryData<Avkreftede>(key, (forrige) => ({
        ...forrige,
        [id]: { versjon: Symbol(), forsok: 0, orgnummer },
    }))
}

export function useAvkreftedeLedere() {
    const testperson = UseTestpersonQuery().query()
    const { data } = useQuery<Avkreftede>({
        queryKey: avkreftedeKey(testperson),
        queryFn: skipToken,
        enabled: false,
        gcTime: Infinity,
    })
    return Object.values(data ?? {})
}

export default function UseNarmesteledere() {
    const testpersonQuery = UseTestpersonQuery()
    const testperson = testpersonQuery.query()
    const queryClient = useQueryClient()
    const queryKey = narmesteledereKey(testperson)
    const standardRetry = queryClient.defaultQueryOptions<unknown, Error>({ queryKey }).retry

    return useQuery<NarmesteLeder[], Error>({
        queryKey,
        retry: (antall, feil) => {
            if (feil instanceof OppfolgingFeil) return false
            const retry = standardRetry ?? (typeof window === 'undefined' ? 0 : 3)
            return typeof retry === 'function'
                ? retry(antall, feil)
                : retry === true || (typeof retry === 'number' && antall < retry)
        },
        refetchInterval: () => {
            const avkreftede = queryClient.getQueryData<Avkreftede>(avkreftedeKey(testperson))
            return avkreftede && Object.values(avkreftede).some((leder) => leder.forsok < MAKS_OPPFOLGINGER)
                ? OPPFOLGINGSINTERVALL_MS
                : false
        },
        queryFn: async ({ signal }) => {
            const key = avkreftedeKey(testperson)
            const vedStart = queryClient.getQueryData<Avkreftede>(key)
            const folgerOpp = !!vedStart && Object.values(vedStart).some((leder) => leder.forsok < MAKS_OPPFOLGINGER)
            try {
                const res: LinemanagerResponse = await fetchJsonMedRequestId(
                    '/syk/sykefravaer/api/narmesteleder/employee/linemanager' + testperson,
                    { signal },
                )
                signal.throwIfAborted()
                const ledere = res.linemanagers.map(tilNarmesteLeder)
                const avkreftede = queryClient.getQueryData<Avkreftede>(key)
                if (!avkreftede) return ledere

                const oppdatert = { ...avkreftede }
                for (const id of Object.keys(avkreftede)) {
                    // Bare et svar startet etter denne avkreftingen kan fjerne markøren.
                    if (
                        vedStart?.[id]?.versjon === avkreftede[id].versjon &&
                        !ledere.some((leder) => leder.id === id)
                    ) {
                        delete oppdatert[id]
                    }
                }
                queryClient.setQueryData(key, oppdatert)
                return ledere.filter((leder) => !(leder.id in oppdatert))
            } catch (feil) {
                if (folgerOpp && !signal.aborted) throw new OppfolgingFeil(feil)
                throw feil
            } finally {
                if (vedStart && !signal.aborted) {
                    queryClient.setQueryData<Avkreftede>(key, (gjeldende) => {
                        if (!gjeldende) return gjeldende
                        const oppdatert = { ...gjeldende }
                        for (const [id, leder] of Object.entries(vedStart)) {
                            if (gjeldende[id]?.versjon === leder.versjon && gjeldende[id].forsok < MAKS_OPPFOLGINGER) {
                                oppdatert[id] = { ...gjeldende[id], forsok: gjeldende[id].forsok + 1 }
                            }
                        }
                        return oppdatert
                    })
                }
            }
        },
    })
}
