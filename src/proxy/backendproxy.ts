import { proxyApiRouteRequest } from '@navikt/next-api-proxy'
import { logger } from '@navikt/next-logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestOboToken } from '@navikt/oasis'

import { cleanPathForMetric } from '../metrics'

interface Opts {
    req: NextApiRequest
    res: NextApiResponse
    tillatteApier: string[]
    backend: string
    hostname: string
    backendClientId: string
    https: boolean
    backendPathPrefix?: string
}

export function byggBackendSti(rewritedPath: string, backendPathPrefix?: string): string {
    if (!backendPathPrefix) {
        return rewritedPath
    }
    return `${backendPathPrefix}${rewritedPath}`
}

export async function proxyKallTilBackend(opts: Opts) {
    if (!opts.req.url) return null
    const rewritedPath = opts.req.url.replace(`/api/${opts.backend}`, '')
    const api = `${opts.req.method} ${rewritedPath}`
    if (!opts.tillatteApier.includes(<string>cleanPathForMetric(api).split('?')[0])) {
        logger.warn('404 Ukjent api: ' + api)
        opts.res.status(404)
        opts.res.send(null)
        return Promise.resolve()
    }

    if (!opts.req.headers.authorization) throw new Error('Mangler authorization header')
    const idportenToken = opts.req.headers.authorization.split(' ')[1]
    const tokenX = await requestOboToken(idportenToken, opts.backendClientId)
    if (!tokenX.ok) {
        throw new Error(`Unable to exchange token for ${opts.backendClientId} token,reason: ${tokenX.error.message}`, {
            cause: tokenX.error,
        })
    }

    const backendPath = byggBackendSti(rewritedPath, opts.backendPathPrefix)
    await proxyApiRouteRequest({ ...opts, path: backendPath, bearerToken: tokenX.token })
}
