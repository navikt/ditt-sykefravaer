import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { logger } from '@navikt/next-logger'

import { SendSykmeldingValues } from 'src/fetching/graphql.generated'
import { SykmeldingUserEventV3Api } from 'src/server/api-models/SendSykmelding'
import { Brukerinformasjon } from 'src/server/api-models/Brukerinformasjon'
import { ErUtenforVentetid } from 'src/server/api-models/ErUtenforVentetid'
import { Sykmelding } from 'src/server/api-models/sykmelding/Sykmelding'
import { fetchMedRequestId } from 'src/utils/fetch'
import { mapSendSykmeldingValuesToV3Api } from 'src/server/sendSykmeldingMapping'

import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { beskyttetApi } from '../../../auth/beskyttetApi'

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

// todo remove me

/*

import { SendSykmeldingValues } from '../fetching/graphql.generated'
import { SykmeldingUserEventV3Api } from './api-models/SendSykmelding'
import { Brukerinformasjon } from './api-models/Brukerinformasjon'
import { ErUtenforVentetid } from './api-models/ErUtenforVentetid'
import { Sykmelding } from './api-models/sykmelding/Sykmelding'

export function mapSendSykmeldingValuesToV3Api(
    values: SendSykmeldingValues,
    sykmelding: Sykmelding,
    brukerinformasjon: Brukerinformasjon,
    erUtenforVentetid: ErUtenforVentetid, api endepunkt som returnerer dette: 
    
    data class ErUtenforVentetidResponse(
    val erUtenforVentetid: Boolean,
    val oppfolgingsdato: LocalDate?,    
)

)

input SendSykmeldingValues {
    erOpplysningeneRiktige: YesOrNo
    uriktigeOpplysninger: [UriktigeOpplysningerType!]
    arbeidssituasjon: ArbeidssituasjonType
    arbeidsgiverOrgnummer: String
    riktigNarmesteLeder: YesOrNo
    harBruktEgenmelding: YesOrNo
    egenmeldingsperioder: [DateRange!]
    harForsikring: YesOrNo
    egenmeldingsdager: [Date!]
    harEgenmeldingsdager: YesOrNo
    fisker: FiskerInput
    arbeidsledig: ArbeidsledigInput
}

*/

function forwardRequestHeaders(req: NextApiRequest): HeadersInit {
    const headers: Record<string, string> = {}

    for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') {
            headers[key] = value
        } else if (Array.isArray(value)) {
            headers[key] = value.join(',')
        }
    }

    return headers
}

export async function getSykmeldinger(req: NextApiRequest): Promise<Sykmelding[]> {
    const res = await fetchMedRequestId('http://flex-sykmeldinger-backend/api/v1/sykmeldinger/', {
        // '/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/sykmeldinger', {
        method: 'GET',
        credentials: 'include',
        headers: forwardRequestHeaders(req),
    })
    return res.response.json()
}

export async function getSykmelding(sykmeldingId: string, req: NextApiRequest): Promise<Sykmelding> {
    const res = await fetchMedRequestId(`http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}`, {
        method: 'GET',
        credentials: 'include',
        headers: forwardRequestHeaders(req),
    })
    return res.response.json()
}

export async function getBrukerinformasjonById(sykmeldingId: string, req: NextApiRequest): Promise<Brukerinformasjon> {
    const res = await fetchMedRequestId(
        `http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/brukerinformasjon`,
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),
        },
    )
    return res.response.json()
}

export async function getErUtenforVentetidResponse(
    sykmeldingId: string,
    req: NextApiRequest,
): Promise<ErUtenforVentetid> {
    const res = await fetchMedRequestId(
        `http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/brukerinformasjon`,
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),
        },
    )
    return res.response.json()
}

export async function sendSykmelding(
    sykmeldingId: string,
    sendSykmeldingValuesPostMapping: SykmeldingUserEventV3Api,
    req: NextApiRequest,
): Promise<SykmeldingUserEventV3Api> {
    const res = await fetchMedRequestId(`http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: forwardRequestHeaders(req),
        body: JSON.stringify(sendSykmeldingValuesPostMapping),
    })
    return res.response.json()
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.url && req.url.includes('/api/v1/sykmeldinger/') && req.url.includes('/send')) {
        const url = req.url ?? ''

        if (url.includes('/api/v1/sykmeldinger/') && url.includes('/send')) {
            sendSykmeldingHandler(req, res)
        }
    } else {
        handlerOld(req, res)
    }
}

const sendSykmeldingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    logger.info(`Handling send sykmelding request første filter url is: ${req.url}`)
    logger.info(`Handling send sykmelding request første filter url is: ${req.url}`)

    if (req.query.path && Array.isArray(req.query.path) && req.query.path.length > 2) {
        logger.info('Handling send sykmelding request andre')
        const pathSegments = req.query.path as string[]
        const uuid = pathSegments?.[3] // Index 2 would be the UUID in /api/v1/sykmeldinger/[uuid]/send

        if (uuid) {
            logger.info('1')
            logger.info(req.query.path[3])
            const sykmeldingen = await getSykmelding(uuid, req)
            logger.info('2')
            const brukerinformasjon = await getBrukerinformasjonById(uuid, req)
            logger.info('3')
            const erUtenforVentetid = await getErUtenforVentetidResponse(uuid, req)
            const sendSykmeldingValues: SendSykmeldingValues = req.body as SendSykmeldingValues

            const sendSykmeldingValuesPostMapping = mapSendSykmeldingValuesToV3Api(
                sendSykmeldingValues,
                sykmeldingen,
                brukerinformasjon,
                erUtenforVentetid,
            )
            logger.info(`SendSykmeldingValues: ${JSON.stringify(sendSykmeldingValues)}`)
            logger.info(`SendSykmeldingValuesPostMapping: ${JSON.stringify(sendSykmeldingValuesPostMapping)}`)

            return res.status(200).json(sendSykmeldingValuesPostMapping)

            const sendSykmeldingResponse = await sendSykmelding(uuid, sendSykmeldingValuesPostMapping, req)
            logger.info(`success: SendSykmeldingResponse: ${JSON.stringify(sendSykmeldingResponse)}`)

            return res.status(200).json(sendSykmeldingResponse)
        } else {
            logger.error(`UUID not found in path segments: ${JSON.stringify(req.query.path)}`)
            return res.status(400).json({ error: 'UUID not found in path segments' })
        }
        return res.status(402).json({
            message: 'hello from the send thing',
        })
    }
}

const handlerOld = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
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
