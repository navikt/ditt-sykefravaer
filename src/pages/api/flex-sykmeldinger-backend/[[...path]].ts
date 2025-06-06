import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { sendSykmeldingHandler } from './SendSykmeldingRequest'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { beskyttetApi } from '../../../auth/beskyttetApi'

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


const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const currentUrl = req.url || ''
    if (currentUrl.includes('/api/v1/sykmeldinger/') && currentUrl.includes('/send')) {
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
