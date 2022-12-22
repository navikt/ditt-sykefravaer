import { logger } from '@navikt/next-logger'
import { NextPageContext } from 'next'

import metrics, { cleanPathForMetric, shouldLogMetricForPath } from '../metrics'
import { GetServerSidePropsPrefetchResult } from '../types/prefecthing'
import { isMockBackend } from '../utils/environment'

import { verifyIdportenAccessToken } from './verifyIdportenAccessToken'

type PageHandler = (context: NextPageContext) => void | Promise<GetServerSidePropsPrefetchResult>

function beskyttetSide(handler: PageHandler) {
    return async function withBearerTokenHandler(context: NextPageContext): Promise<ReturnType<typeof handler>> {
        if (isMockBackend()) {
            return handler(context)
        }

        const request = context.req

        if (request == null) {
            throw new Error('Context is missing request. This should not happen')
        }
        const cleanPath = cleanPathForMetric(request.url)
        if (shouldLogMetricForPath(cleanPath)) {
            metrics.pageInitialLoadCounter.inc({ path: cleanPath }, 1)
        }

        const wonderwallRedirect = {
            redirect: {
                destination: '/oauth2/login?redirect=/syk/sykefravaer',
                permanent: false,
            },
        }
        const bearerToken: string | null | undefined = request.headers['authorization']
        if (!bearerToken) {
            if (shouldLogMetricForPath(cleanPath)) {
                metrics.wonderwallRedirect.inc({ path: cleanPath }, 1)
            }
            return wonderwallRedirect
        }
        try {
            await verifyIdportenAccessToken(bearerToken)
        } catch (e) {
            if (shouldLogMetricForPath(cleanPath)) {
                metrics.wonderwallRedirect.inc({ path: cleanPath }, 1)
            }
            logger.error(e, 'Kunne ikke validere idporten token på beskyttetSide.')
            return wonderwallRedirect
        }
        return handler(context)
    }
}

export const beskyttetSideUtenProps = beskyttetSide(async (): Promise<GetServerSidePropsPrefetchResult> => {
    return {
        props: {},
    }
})
