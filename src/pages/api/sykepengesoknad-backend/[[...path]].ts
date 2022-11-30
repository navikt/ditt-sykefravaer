import { proxiedApiRouteConfig } from '@navikt/next-api-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['GET /api/v2/soknader', 'GET /api/v2/soknader/metadata']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'sykepengesoknad-backend',
        hostname: 'sykepengesoknad-backend',
        backendClientId: serverRuntimeConfig.sykepengesoknadBackendClientId,
        https: false,
    })
})

export const config = proxiedApiRouteConfig

export default handler
