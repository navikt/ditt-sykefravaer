import { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { getServerEnv } from '../../../utils/env'

export const tillatteApier = ['GET /employee/linemanager', 'DELETE /linemanager/[uuid]']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'narmesteleder',
        hostname: 'esyfo-narmesteleder.team-esyfo',
        backendClientId: getServerEnv().ESYFO_NARMESTELEDER_CLIENT_ID,
        https: false,
        backendPathPrefix: '/internal/api/v1',
    })
})

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
