import { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { getServerEnv } from '../../../utils/env'

const tillatteApier = [
    'GET /api/v1/inntektsmeldinger',
    'GET /api/v1/meldinger',
    'POST /api/v1/meldinger/[uuid]/lukk',
    'POST /api/v1/meldinger/esyfovarsel-[uuid]/lukk',
]

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'ditt-sykefravaer-backend',
        hostname: 'ditt-sykefravaer-backend',
        backendClientId: getServerEnv().DITT_SYKEFRAVAER_BACKEND_CLIENT_ID,
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
