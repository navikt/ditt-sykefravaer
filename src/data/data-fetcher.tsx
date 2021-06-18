import Spinner from 'nav-frontend-spinner'
import React, { useEffect } from 'react'

import IngenData from '../pages/feil/ingen-data'
import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { NarmesteLeder } from '../types/narmesteLeder'
import { RSSoknad } from '../types/rs-types/rs-soknad'
import { RSVedtakWrapper } from '../types/rs-types/rs-vedtak'
import { Soknad } from '../types/soknad'
import { Sykmelding } from '../types/sykmelding'
import env from '../utils/environment'
import { logger } from '../utils/logger'
import useFetch from './rest/use-fetch'
import { FetchState, hasAny401, hasAnyFailed, hasData, isAnyNotStartedOrPending, isNotStarted } from './rest/utils'
import { useAppStore } from './stores/app-store'

export function DataFetcher(props: { children: any }) {
    const {
        setSoknader,
        setRsVedtak,
        setSykmeldinger,
        setArbeidsrettetOppfolging,
        setSnartSluttPaSykepengene,
        setNarmesteLedere,
    } = useAppStore()
    const rssoknader = useFetch<RSSoknad[]>()
    const rsVedtak = useFetch<RSVedtakWrapper[]>()
    const sykmeldinger = useFetch<Sykmelding[]>()
    const arbeidsrettetOppfolgingFetch = useFetch<ArbeidsrettetOppfolging>()
    const snartSlutt = useFetch<boolean>()
    const narmesteLedere = useFetch<NarmesteLeder[]>()


    const alleHooks = [ rssoknader, rsVedtak, snartSlutt, sykmeldinger, arbeidsrettetOppfolgingFetch, narmesteLedere ]

    useEffect(() => {
        if (isNotStarted(rssoknader)) {
            rssoknader.fetch(env.flexGatewayRoot + '/syfosoknad/api/soknader', {
                credentials: 'include',
            }, (fetchState: FetchState<RSSoknad[]>) => {
                if (hasData(fetchState)) {
                    setSoknader(fetchState.data!.map(soknad => {
                        return new Soknad(soknad)
                    }))
                }
            })
        }

        if (isNotStarted(snartSlutt)) {
            snartSlutt.fetch(env.flexGatewayRoot + '/syfosoknad/api/syfosyketilfelle/39ukersvarsel', {
                credentials: 'include',
            }, (fetchState: FetchState<boolean>) => {
                if (hasData(fetchState)) {
                    setSnartSluttPaSykepengene(fetchState.data)
                }
            })
        }

        if (isNotStarted(arbeidsrettetOppfolgingFetch)) {
            arbeidsrettetOppfolgingFetch.fetch(env.flexGatewayRoot + '/veilarboppfolging/api/oppfolging', {
                credentials: 'include',
            }, (fetchState: FetchState<ArbeidsrettetOppfolging>) => {
                if (hasData(fetchState)) {
                    setArbeidsrettetOppfolging(fetchState.data)
                }
            })
        }

        if (isNotStarted(rsVedtak)) {
            rsVedtak.fetch(env.flexGatewayRoot + '/spinnsyn-backend/api/v2/vedtak', {
                credentials: 'include',
            }, (fetchState: FetchState<RSVedtakWrapper[]>) => {
                if (hasData(fetchState)) {
                    setRsVedtak(fetchState.data)
                }
            })
        }

        if (isNotStarted(sykmeldinger)) {
            sykmeldinger.fetch(env.sykmeldingerBackendProxyRoot + '/api/v1/sykmeldinger', {
                credentials: 'include',
            }, (fetchState: FetchState<Sykmelding[]>) => {
                if (hasData(fetchState)) {
                    setSykmeldinger(fetchState.data)
                }
            })
        }

        if (isNotStarted(narmesteLedere)) {
            narmesteLedere.fetch(env.narmestelederUrl + '/user/sykmeldt/narmesteledere', {
                credentials: 'include',
            }, (fetchState: FetchState<NarmesteLeder[]>) => {
                if (hasData(fetchState)) {
                    setNarmesteLedere(fetchState.data)
                }
            })
        }

        // eslint-disable-next-line
    }, alleHooks);

    if (hasAny401(alleHooks)) {
        window.location.href = hentLoginUrl()

    } else if (isAnyNotStartedOrPending(alleHooks)) {
        return <Spinner type={'XXL'} />

    } else if (hasAnyFailed(alleHooks)) {
        // TODO være litt mer graceful ved feil?
        logger.error(`Klarer ikke hente en av disse [ rssoknader = ${rssoknader.httpCode}, rsVedtak = ${rsVedtak.httpCode} ]`)
        return <IngenData />
    }

    return props.children
}

export const hentLoginUrl = () => {
    return `${env.loginServiceUrl}?redirect=${env.loginServiceRedirectUrl}`
}
