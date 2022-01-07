import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

import { isDev, isMockBackend, spinnsynFrontendInterne } from '../utils/environment'
import { logger } from '../utils/logger'
import { verifyIdportenAccessToken } from './verifyIdportenAccessToken'
import { validerLoginserviceToken } from './verifyLoginserviceAccessToken'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

export function beskyttetApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res) {
        if (isMockBackend()) {
            return handler(req, res)
        }

        if (spinnsynFrontendInterne()) {
            return beskyttetApiInterne(req, res)
        }

        function send401() {
            res.status(401).json({ message: 'Access denied' })
        }

        const cookies = cookie.parse(req?.headers.cookie || '')
        const selvbetjeningIdtoken = cookies[ 'selvbetjening-idtoken' ]
        if (!selvbetjeningIdtoken) {
            return send401()
        }
        try {
            await validerLoginserviceToken(selvbetjeningIdtoken)
        } catch (e) {
            return send401()
        }

        const bearerToken: string | null | undefined = req.headers[ 'authorization' ]
        if (!bearerToken) {
            return send401()
        }
        try {
            await verifyIdportenAccessToken(bearerToken)
        } catch (e) {
            logger.warn('kunne ikke validere idportentoken i beskyttetApi', e)
            return send401()
        }

        return handler(req, res)
    }

    async function beskyttetApiInterne(req: NextApiRequest, res: NextApiResponse) {
        // Ingen av APIene brukes for øyeblikket av spinnsyn-interne
        res.status(401).json({ message: 'Access denied' })
        return
    }
}

