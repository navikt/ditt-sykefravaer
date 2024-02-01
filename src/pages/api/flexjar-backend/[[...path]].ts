import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { logger } from '@navikt/next-logger'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { isMockBackend } from '../../../utils/environment'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['POST /api/v1/feedback', 'POST /api/v2/feedback', 'PUT /api/v2/feedback/[uuid]']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    if (isMockBackend()) {
        logger.info('Mottok feedback')
        res.status(202)
        res.end()
        return
    }
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'flexjar-backend',
        hostname: 'flexjar-backend',
        backendClientId: serverRuntimeConfig.flexjarBackendClientId,
        https: false,
    })
})

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
