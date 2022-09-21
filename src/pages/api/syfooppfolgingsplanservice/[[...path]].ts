import { proxiedApiRouteConfig } from '@navikt/next-api-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = ['GET /syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner']

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'syfooppfolgingsplanservice',
        hostname: serverRuntimeConfig.syfooppfolgingsplanserviceHost,
        backendClientId: serverRuntimeConfig.syfooppfolgingsplanserviceClientId,
        https: true,
    })
})

export const config = proxiedApiRouteConfig

export default handler
