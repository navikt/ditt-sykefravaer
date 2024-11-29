import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['GET /api/v1/sykmeldinger']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'flex-sykmeldinger-backend',
        hostname: 'flex-sykmeldinger-backend',
        backendClientId: serverRuntimeConfig.flexSykmeldingerBackendClientId,
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
