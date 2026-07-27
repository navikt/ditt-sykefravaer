import { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { getServerEnv } from '../../../utils/env'

const tillatteApier = ['GET /syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'syfooppfolgingsplanservice',
        hostname: getServerEnv().SYFOOPPFOLGINGSPLANSERVICE_HOST,
        backendClientId: getServerEnv().SYFOOPPFOLGINGSPLANSERVICE_CLIENT_ID,
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
