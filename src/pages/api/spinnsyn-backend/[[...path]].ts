import { proxiedApiRouteConfig } from '@navikt/next-api-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['GET /api/v3/vedtak']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'spinnsyn-backend',
        hostname: 'spinnsyn-backend',
        backendClientId: serverRuntimeConfig.spinnsynBackendClientId,
        https: false,
    })
})

export const config = proxiedApiRouteConfig

export default handler
