import { logger } from '@navikt/next-logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateIdportenToken } from '@navikt/oasis'

import { cleanPathForMetric } from '../metrics'
import metrics from '../metrics'
import { isMockBackend } from '../utils/environment'
import { mockApi } from '../data/mock/mock-api'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

export function beskyttetApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cleanPath = cleanPathForMetric(req.url!)

        function send401() {
            metrics.apiUnauthorized.inc({ path: cleanPath }, 1)

            res.status(401).json({ message: 'Access denied' })
        }

        if (isMockBackend()) {
            return mockApi(req, res)
        }

        const bearerToken: string | null | undefined = req.headers['authorization']
        if (!bearerToken) {
            return send401()
        }
        const result = await validateIdportenToken(bearerToken)
        if (!result.ok) {
            logger.warn('kunne ikke validere idportentoken i beskyttetApi')
            return send401()
        }

        metrics.apiAuthorized.inc({ path: cleanPath }, 1)
        return handler(req, res)
    }
}
