import { proxyApiRouteRequest } from '@navikt/next-api-proxy'
import { logger } from '@navikt/next-logger'
import * as http from 'http'
import { ClientRequestArgs, RequestOptions } from 'http'
import * as https from 'https'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'

import { getTokenxToken } from '../auth/getTokenxToken'
import { cleanPathForMetric } from '../metrics'
import { stream2buffer } from './stream2buffer'

interface Opts {
    req: NextApiRequest
    res: NextApiResponse
    tillatteApier: String[]
    backend: string
    hostname: string
    backendClientId: string
    https: boolean
}

export async function proxyKallTilBackend(opts: Opts) {
    const rewritedPath = opts.req.url!.replace(`/api/${opts.backend}`, '')
    const api = `${opts.req.method} ${rewritedPath}`
    if (!opts.tillatteApier.includes(<String>cleanPathForMetric(api))) {
        logger.warn('404 Ukjent api: ' + api)
        opts.res.status(404)
        opts.res.send(null)
        return
    }

    const idportenToken = opts.req.headers.authorization!.split(' ')[1]
    const tokenxToken = await getTokenxToken(idportenToken, opts.backendClientId)

    await proxyApiRouteRequest({ ...opts, path: rewritedPath, bearerToken: tokenxToken! })
}
