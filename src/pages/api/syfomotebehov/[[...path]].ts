import { proxiedApiRouteConfig } from '@navikt/next-api-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['GET /syfomotebehov/api/v3/arbeidstaker/motebehov']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'syfomotebehov',
        hostname: serverRuntimeConfig.syfomotebehovHost,
        backendClientId: serverRuntimeConfig.syfomotebehovClientId,
        https: true,
    })
})

export const config = proxiedApiRouteConfig

export default handler
