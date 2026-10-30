import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

import { LinemanagerResponse, NarmesteLeder, tilNarmesteLeder } from '../types/narmesteLeder'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export const AVKREFTET_NARMESTELEDER_QUERY_KEY = ['narmesteleder-avkreftet']

// Sporer avkreftede ledere per QueryClient for å hindre at asynkron sletting (202 Accepted)
// overskrives av et etterfølgende uoppdatert GET-kall i samme sesjon.
const avkreftedeLedereMap = new WeakMap<QueryClient, Set<string>>()

export function registrerAvkreftetLeder(queryClient: QueryClient, id: string): void {
    let set = avkreftedeLedereMap.get(queryClient)
    if (!set) {
        set = new Set()
        avkreftedeLedereMap.set(queryClient, set)
    }
    set.add(id)

    queryClient.setQueryData<string[]>(AVKREFTET_NARMESTELEDER_QUERY_KEY, (prev) => {
        if (!prev) return [id]
        if (prev.includes(id)) return prev
        return [...prev, id]
    })
}

export function hentAvkreftedeLederIder(queryClient: QueryClient): Set<string> {
    const set = new Set<string>(avkreftedeLedereMap.get(queryClient) ?? [])
    const fraCache = queryClient.getQueryData<string[]>(AVKREFTET_NARMESTELEDER_QUERY_KEY) ?? []
    fraCache.forEach((id) => set.add(id))
    return set
}

export default function UseNarmesteledere() {
    const testpersonQuery = UseTestpersonQuery()
    const queryClient = useQueryClient()

    return useQuery<NarmesteLeder[], Error>({
        queryKey: ['narmesteledere'],
        queryFn: async () => {
            const res: LinemanagerResponse = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/narmesteleder/internal/api/v1/employee/linemanager' + testpersonQuery.query(),
            )
            const avkreftede = hentAvkreftedeLederIder(queryClient)
            return res.linemanagers.map(tilNarmesteLeder).filter((nl) => !avkreftede.has(nl.id))
        },
        select: (data) => {
            const avkreftede = hentAvkreftedeLederIder(queryClient)
            return data.filter((nl) => !avkreftede.has(nl.id))
        },
    })
}
