import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { logger } from '@navikt/next-logger'
import { requestOboToken } from '@navikt/oasis'

import { SendSykmeldingValues } from 'src/fetching/graphql.generated'
import { SykmeldingUserEventV3Api } from 'src/server/api-models/SendSykmelding'
import { Brukerinformasjon } from 'src/server/api-models/Brukerinformasjon'
import { ErUtenforVentetid } from 'src/server/api-models/ErUtenforVentetid'
import { Sykmelding } from 'src/server/api-models/sykmelding/Sykmelding'
import { fetchMedRequestId } from 'src/utils/fetch' // Assuming fetchMedRequestId returns { response: Response, ... }
import { mapSendSykmeldingValuesToV3Api } from 'src/server/sendSykmeldingMapping'

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



function createBackendHeaders(
    req: NextApiRequest,
    oboToken: string,
    isJsonPayload: boolean = false,
): Record<string, string> {
    const headers: Record<string, string> = {}

    const headersToForward = ['x-request-id', 'nav-call-id']
    for (const headerName of headersToForward) {
        const headerValue = req.headers[headerName.toLowerCase()]
        if (typeof headerValue === 'string') {
            headers[headerName] = headerValue
        } else if (Array.isArray(headerValue)) {
            headers[headerName] = headerValue.join(',')
        }
    }

    headers['Authorization'] = `Bearer ${oboToken}`
    if (isJsonPayload) {
        headers['Content-Type'] = 'application/json'
    }
    return headers
}

export async function getSykmeldinger(req: NextApiRequest, res: NextApiResponse): Promise<void> {
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

export async function getSykmelding(sykmeldingId: string, req: NextApiRequest, oboToken: string): Promise<Sykmelding> {
    const backendHeaders = createBackendHeaders(req, oboToken)
    const result = await fetchMedRequestId(`http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}`, {
        method: 'GET',
        headers: backendHeaders,
    })
    if (!result.response.ok) {
        const errorText = await result.response.text()
        throw new Error(
            `Failed to fetch sykmelding: ${result.response.status} ${result.response.statusText}. Body: ${errorText}`,
        )
    }
    return result.response.json()
}

export async function getBrukerinformasjonById(
    sykmeldingId: string,
    req: NextApiRequest,
    oboToken: string,
): Promise<Brukerinformasjon> {
    const backendHeaders = createBackendHeaders(req, oboToken)
    const result = await fetchMedRequestId(
        `http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/brukerinformasjon`,
        {
            method: 'GET',
            headers: backendHeaders,
        },
    )
    if (!result.response.ok) {
        const errorText = await result.response.text()
        throw new Error(
            `Failed to fetch brukerinformasjon: ${result.response.status} ${result.response.statusText}. Body: ${errorText}`,
        )
    }
    return result.response.json()
}

export async function getErUtenforVentetidResponse(
    sykmeldingId: string,
    req: NextApiRequest,
    oboToken: string,
): Promise<ErUtenforVentetid> {
    logger.info(`Fetching erUtenforVentetid for sykmelding with ID: ${sykmeldingId}`)
    const backendHeaders = createBackendHeaders(req, oboToken)
    const result = await fetchMedRequestId(
        `http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/er-utenfor-ventetid`,
        {
            method: 'GET',
            headers: backendHeaders,
        },
    )
    logger.info(`Response from erUtenforVentetid: ${result.response.status} ${result.response.statusText}`)
    if (!result.response.ok) {
        const errorText = await result.response.text()
        throw new Error(
            `Failed to fetch erUtenforVentetid: ${result.response.status} ${result.response.statusText}. Body: ${errorText}`,
        )
    }
    return result.response.json()
}

export async function sendSykmelding(
    sykmeldingId: string,
    sendSykmeldingValuesPostMapping: SykmeldingUserEventV3Api,
    req: NextApiRequest,
    oboToken: string,
): Promise<SykmeldingUserEventV3Api> {
    const backendHeaders = createBackendHeaders(req, oboToken, true)
    const result = await fetchMedRequestId(
        `http://flex-sykmeldinger-backend/api/v1/sykmeldinger/${sykmeldingId}/send`,
        {
            method: 'POST',
            headers: backendHeaders,
            body: JSON.stringify(sendSykmeldingValuesPostMapping),
        },
    )
    logger.info(`Response from send sykmelding: ${result.response.status} ${result.response.statusText}`)
    if (!result.response.ok) {
        const errorBody = await result.response.text()
        logger.error(
            `Error sending sykmelding: ${result.response.status} ${result.response.statusText} - Body: ${errorBody}`,
        )
        throw new Error(
            `Failed to send sykmelding: ${result.response.status} ${result.response.statusText}. Body: ${errorBody}`,
        )
    }
    return result.response.json()
}

async function parseJsonBody<T>(req: NextApiRequest): Promise<T> {
    return new Promise((resolve, reject) => {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            try {
                resolve(JSON.parse(data))
            } catch (e) {
                logger.error('Failed to parse JSON body:', e)
                reject(new Error('Invalid JSON body'))
            }
        })
        req.on('error', (err) => {
            logger.error('Error reading request stream for body parsing:', err)
            reject(err)
        })
    })
}

const sendSykmeldingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    logger.info(`Handling send sykmelding request: ${req.url}`)

    // req.query.path is typically an array of path segments for dynamic routes like /api/[...path].ts
    // Example: /api/v1/sykmeldinger/the-uuid/send -> req.query.path = ['v1', 'sykmeldinger', 'the-uuid', 'send']
    // Verify the index for 'uuid' based on your file structure and routing.
    // If file is pages/api/v1/sykmeldinger/[uuid]/send.ts, req.query.uuid would be simpler.
    const pathSegments = req.query.path as string[] | undefined
    const uuid = pathSegments?.[3] // Verify this index. If path = ['v1','sykmeldinger','uuid','send'], then pathSegments[2] is uuid.

    if (req.method !== 'POST') {
        logger.warn(`Method Not Allowed: ${req.method} for sendSykmeldingHandler`)
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    if (uuid) {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                logger.warn('Authorization header missing or not Bearer token for sendSykmeldingHandler')
                return res.status(401).json({ error: 'Invalid or missing authorization header' })
            }
            const idPortenToken = authorizationHeader.split(' ')[1]

            const oboTokenResponse = await requestOboToken(
                idPortenToken,
                serverRuntimeConfig.flexSykmeldingerBackendClientId,
            )

            if (!oboTokenResponse.ok) {
                logger.error(
                    `OBO token exchange failed for ${serverRuntimeConfig.flexSykmeldingerBackendClientId}: ${oboTokenResponse.error.message}`,
                    oboTokenResponse.error,
                )
                return res.status(502).json({ error: 'Failed to authenticate with backend service (OBO)' })
            }
            const oboToken = oboTokenResponse.token
            logger.info(`Successfully obtained OBO token for sykmelding ID: ${uuid}`)

            // Manually parse body as bodyParser is false
            const sendSykmeldingValues = await parseJsonBody<SendSykmeldingValues>(req)

            // Fetch all required data using the OBO token
            const sykmeldingen = await getSykmelding(uuid, req, oboToken)
            logger.info(`Sykmeldingen variable for ${uuid}: ${JSON.stringify(sykmeldingen)}`)
            const brukerinformasjon = await getBrukerinformasjonById(uuid, req, oboToken)
            logger.info(`Brukerinformasjon for ${uuid}: ${JSON.stringify(brukerinformasjon)}`)
            const erUtenforVentetid = await getErUtenforVentetidResponse(uuid, req, oboToken)
            logger.info(`ErUtenforVentetid for ${uuid}: ${JSON.stringify(erUtenforVentetid)}`)

            const sendSykmeldingValuesPostMapping = mapSendSykmeldingValuesToV3Api(
                sendSykmeldingValues,
                sykmeldingen,
                brukerinformasjon,
                erUtenforVentetid,
            )
            logger.info(
                `Mapped SendSykmeldingValuesPostMapping for ${uuid}: ${JSON.stringify(sendSykmeldingValuesPostMapping)}`,
            )

            const sendSykmeldingResponse = await sendSykmelding(uuid, sendSykmeldingValuesPostMapping, req, oboToken)
            logger.info(`Successfully sent sykmelding ${uuid}: ${JSON.stringify(sendSykmeldingResponse)}`)

            return res.status(200).json(sendSykmeldingResponse)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            logger.error(`Error in sendSykmeldingHandler for ${uuid}: ${error.message}`, {
                stack: error.stack,
                cause: error.cause,
            })
            if (error.message.toLowerCase().includes('invalid json body')) {
                return res.status(400).json({ error: 'Invalid JSON in request body' })
            }
            if (
                error.message.includes('Failed to fetch') ||
                error.message.includes('Failed to send') ||
                (error.response && error.response.status >= 500) // For errors from fetchMedRequestId if structured that way
            ) {
                return res.status(502).json({ error: 'Error communicating with backend service' })
            }
            return res.status(500).json({ error: 'Internal server error while sending sykmelding' })
        }
    } else {
        logger.error(
            `UUID not found or invalid path for sendSykmeldingHandler. URL: ${req.url}, Path segments: ${JSON.stringify(pathSegments)}`,
        )
        return res.status(400).json({ error: 'Invalid request path or UUID missing' })
    }
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    // Ensure req.url is defined before using .includes
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
            https: false, // Assuming HTTP for internal cluster communication
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
