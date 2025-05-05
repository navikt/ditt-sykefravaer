import { logger } from '@navikt/next-logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateIdportenToken } from '@navikt/oasis'

import { isMockBackend } from '../utils/environment'
import { mockApi } from '../data/mock/mock-api'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

export function beskyttetApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res) {
        function send401() {
            logger.warn('beskyttetApi: 401 Unauthorized')
            res.status(401).json({ message: 'Access denied' })
        }

        // if (isMockBackend() && !(req.url && req.url.includes('/api/v1/sykmeldinger/') && req.url.includes('/send'))) {
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

        return handler(req, res)
    }
}
