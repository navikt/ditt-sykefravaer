import { NextApiRequest, NextApiResponse } from 'next'

import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { beskyttetApi } from '../../../auth/beskyttetApi'
import { isPostSykmeldingSend, extractSykmeldingIdFromUrl } from '../../../utils/sykmeldingUtils'
import { getServerEnv } from '../../../utils/env'

import { sendSykmeldingHandler } from './SendSykmeldingRequest'

const tillatteApier = [
    'GET /api/v1/sykmeldinger',
    'GET /api/v1/sykmeldinger/[uuid]',
    'POST /api/v1/sykmeldinger/[uuid]/send',
    'POST /api/v1/sykmeldinger/[uuid]/change-status',
    'GET /api/v1/sykmeldinger/[uuid]/er-utenfor-ventetid',
    'GET /api/v1/sykmeldinger/[uuid]/er-forste-sykmelding/[arbeidssituasjon]',
    'GET /api/v1/sykmeldinger/[uuid]/brukerinformasjon',
    'GET /api/v1/sykmeldinger/[uuid]/tidligere-arbeidsgivere',
    'GET /api/v1/sykmeldinger/[uuid]/har-soknad',
    'POST /api/v1/sykmeldinger/[uuid]/opt-in',
]

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
            backendClientId: getServerEnv().FLEX_SYKMELDINGER_BACKEND_CLIENT_ID,
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
