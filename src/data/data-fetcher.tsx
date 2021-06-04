import Spinner from 'nav-frontend-spinner'
import React, { useEffect } from 'react'

import IngenData from '../pages/feil/ingen-data'
import { RSSoknad } from '../types/rs-types/rs-soknad'
import { RSVedtakWrapper } from '../types/rs-types/rs-vedtak'
import { Soknad } from '../types/soknad'
import env from '../utils/environment'
import { logger } from '../utils/logger'
import useFetch from './rest/use-fetch'
import { FetchState, hasAny401, hasAnyFailed, hasData, isAnyNotStartedOrPending, isNotStarted } from './rest/utils'
import { useAppStore } from './stores/app-store'

export function DataFetcher(props: { children: any }) {
    const { setSoknader, setRsVedtak } = useAppStore()
    const rssoknader = useFetch<RSSoknad[]>()
    const rsVedtak = useFetch<RSVedtakWrapper[]>()

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
    }, [rssoknader, rsVedtak]);

    if (hasAny401([ rssoknader, rsVedtak ])) {
        window.location.href = hentLoginUrl()

    } else if (isAnyNotStartedOrPending([ rsVedtak ])) {
        return <Spinner type={'XXL'} />

    } else if (hasAnyFailed([ rssoknader, rsVedtak ])) {
        logger.error(`Klarer ikke hente en av disse [ rssoknader = ${rssoknader.httpCode}, rsVedtak = ${rsVedtak.httpCode} ]`)
        return <IngenData />
    }

    return props.children
}

export const hentLoginUrl = () => {
    return `${env.loginServiceUrl}?redirect=${env.loginServiceRedirectUrl}`
}
