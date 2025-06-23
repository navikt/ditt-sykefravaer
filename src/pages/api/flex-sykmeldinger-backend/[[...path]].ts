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

export const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/
const POST_SYKMELDING_SEND_REGEX = new RegExp(
    `^/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/(${UUID_REGEX.source})/send$`,
)

function isPostSykmeldingSend(url: string): boolean {
    return POST_SYKMELDING_SEND_REGEX.test(url)
}

function extractSykmeldingIdFromUrl(url: string): string | null {
    const match = url.match(POST_SYKMELDING_SEND_REGEX)
    return match ? match[1] : null
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const currentUrl = req.url || ''

    if (isPostSykmeldingSend(currentUrl)) {
        const sykmeldingId = extractSykmeldingIdFromUrl(currentUrl)

        await sendSykmeldingHandler(req, res, sykmeldingId as string | null)
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
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
