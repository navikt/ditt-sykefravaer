import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import * as sykmeldingerService from '../../../services/sykmeldingerService'

const { serverRuntimeConfig } = getConfig()

const tillatteApier = [
    'GET /api/v1/sykmeldinger',
    'GET /api/v1/sykmeldinger/[uuid]',
    'POST /api/v1/sykmeldinger/[uuid]/send',
    'POST /api/v1/sykmeldinger/[uuid]/changestatus',
    'GET /api/v1/sykmeldinger/[uuid]/er-utenfor-ventetid',
    'GET /api/v1/sykmeldinger/[uuid]/brukerinformasjon',
    'GET /api/v1/sykmeldinger/[uuid]/tidligere-arbeidsgivere',
    // Add your intercepted endpoint here if needed
]

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method ?? ''
    const url = req.url ?? ''

    if (
        url.includes('/api/v1/sykmeldinger/[uuid]/send') &&
        // url.includes('/api/v1/sykmeldinger/[uuid]/send') 
        /^\/api\/v1\/sykmeldinger\/[^/]+\/send$/.test(url)
       ) {
        // sendSykmelding

        // Intercepted logic goes here
        sykmeldingerService.logSendSykmeldingEvent(req, res)
    }

    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'flex-sykmeldinger-backend',
        hostname: 'flex-sykmeldinger-backend',
        backendClientId: serverRuntimeConfig.flexSykmeldingerBackendClientId,
        https: false,
    })
})

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
