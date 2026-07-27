import { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { getServerEnv } from '../../../utils/env'

const tillatteApier = ['GET /api/v3/vedtak']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'spinnsyn-backend',
        hostname: 'spinnsyn-backend',
        backendClientId: getServerEnv().SPINNSYN_BACKEND_CLIENT_ID,
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
