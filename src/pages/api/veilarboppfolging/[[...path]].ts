import { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { getServerEnv } from '../../../utils/env'

const tillatteApier = ['GET /veilarboppfolging/api/v2/oppfolging']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'veilarboppfolging',
        hostname: getServerEnv().VEILARBOPPFOLGING_HOST,
        backendClientId: getServerEnv().VEILARBOPPFOLGING_CLIENT_ID,
        https: true,
    })
})

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
