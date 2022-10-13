import { proxiedApiRouteConfig } from '@navikt/next-api-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = [
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
        backendClientId: serverRuntimeConfig.dittSykefravaerBackendClientId,
        https: false,
    })
})

export const config = proxiedApiRouteConfig

export default handler
