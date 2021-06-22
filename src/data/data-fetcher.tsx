import Spinner from 'nav-frontend-spinner'
import React, { useEffect } from 'react'

import IngenData from '../pages/feil/ingen-data'
import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { RSVedtakWrapper } from '../types/rs-types/rs-vedtak'
import env from '../utils/environment'
import { logger } from '../utils/logger'
import useFetch from './rest/use-fetch'
import { FetchState, hasAny401, hasAnyFailed, hasData, isAnyNotStartedOrPending, isNotStarted } from './rest/utils'
import { useAppStore } from './stores/app-store'

export function DataFetcher(props: { children: any }) {
    const {
        setRsVedtak,
        setArbeidsrettetOppfolging,
    } = useAppStore()
    const rsVedtak = useFetch<RSVedtakWrapper[]>()
    const arbeidsrettetOppfolgingFetch = useFetch<ArbeidsrettetOppfolging>()

    const alleHooks = [ rsVedtak, arbeidsrettetOppfolgingFetch ]

    useEffect(() => {

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


        // eslint-disable-next-line
    }, alleHooks);

    if (hasAny401(alleHooks)) {
        window.location.href = hentLoginUrl()

    } else if (isAnyNotStartedOrPending(alleHooks)) {
        return <Spinner type={'XXL'} />

    } else if (hasAnyFailed(alleHooks)) {
        // TODO være litt mer graceful ved feil?
        logger.error('Klarer ikke hente en av en del ting} ]')
        return <IngenData />
    }

    return props.children
}

export const hentLoginUrl = () => {
    return `${env.loginServiceUrl}?redirect=${env.loginServiceRedirectUrl}`
}
