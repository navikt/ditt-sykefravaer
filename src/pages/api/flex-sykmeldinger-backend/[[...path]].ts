import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { beskyttetApi } from '../../../auth/beskyttetApi'

import { sendSykmeldingHandler } from './SendSykmeldingRequest'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = [
    'GET /api/v1/sykmeldinger',
    'GET /api/v1/sykmeldinger/[uuid]',
    'POST /api/v1/sykmeldinger/[uuid]/send',
    'POST /api/v1/sykmeldinger/[uuid]/change-status',
    'GET /api/v1/sykmeldinger/[uuid]/er-utenfor-ventetid',
    'GET /api/v1/sykmeldinger/[uuid]/brukerinformasjon',
    'GET /api/v1/sykmeldinger/[uuid]/tidligere-arbeidsgivere',
]

const POST_SYKMELDING_SEND_REGEX =
    /^\/api\/flex-sykmeldinger-backend\/api\/v1\/sykmeldinger\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\/send$/

function isPostSykmeldingSend(url: string): boolean {
    return POST_SYKMELDING_SEND_REGEX.test(url)
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const currentUrl = req.url || ''

    if (isPostSykmeldingSend(currentUrl)) {
        await sendSykmeldingHandler(req, res)
    } else {
        await proxyKallTilBackend({
            req,
            res,
            tillatteApier,
            backend: 'flex-sykmeldinger-backend',
            hostname: 'flex-sykmeldinger-backend',
            backendClientId: serverRuntimeConfig.flexSykmeldingerBackendClientId,
            https: false,
        })
    }
})

export const config = {
    api: {
        bodyParser: false, // Manual parsing is implemented in sendSykmeldingHandler
        externalResolver: true,
    },
}

export default handler

/*

import { logger } from '@navikt/next-logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { validateIdportenToken } from '@navikt/oasis'

import { isMockBackend } from '../utils/environment'
import { mockApi } from '../data/mock/mock-api'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

export function beskyttetApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res) {
        function send401() {
            res.status(401).json({ message: 'Access denied' })
        }

        if (isMockBackend() && !(req.url && req.url.includes('/api/v1/sykmeldinger/') && req.url.includes('/send'))) {
            return mockApi(req, res)
        }

        const bearerToken: string | null | undefined = req.headers['authorization']
        if (!bearerToken) {
            return send401()
        }
        const result = await validateIdportenToken(bearerToken)
        if (!result.ok) {
            logger.warn('kunne ikke validere idportentoken i beskyttetApi')
            return send401()
        }

        return handler(req, res)
    }
}


*/
