import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { logger } from '@navikt/next-logger'
import { requestOboToken } from '@navikt/oasis'

import { SendSykmeldingValues } from '../../../fetching/graphql.generated'
import { SykmeldingUserEventV3Api } from '../../../server/api-models/SendSykmelding'
import { Brukerinformasjon } from '../../../server/api-models/Brukerinformasjon'
import { ErUtenforVentetid } from '../../../server/api-models/ErUtenforVentetid'
import { Sykmelding } from '../../../server/api-models/sykmelding/Sykmelding'
import { fetchMedRequestId } from '../../../utils/fetch'
import { mapSendSykmeldingValuesToV3Api } from '../../../server/sendSykmeldingMapping'

const { serverRuntimeConfig } = getConfig()

const flexSykmeldingerHostname = 'flex-sykmeldinger-backend'


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

export async function getSykmelding(sykmeldingId: string, req: NextApiRequest, oboToken: string): Promise<Sykmelding> {
    const backendHeaders = createBackendHeaders(req, oboToken)
    const result = await fetchMedRequestId(`http://${flexSykmeldingerHostname}/api/v1/sykmeldinger/${sykmeldingId}`, {
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
        `http://${flexSykmeldingerHostname}/api/v1/sykmeldinger/${sykmeldingId}/brukerinformasjon`,
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
    const backendHeaders = createBackendHeaders(req, oboToken)
    const result = await fetchMedRequestId(
        `http://${flexSykmeldingerHostname}/api/v1/sykmeldinger/${sykmeldingId}/er-utenfor-ventetid`,
        {
            method: 'GET',
            headers: backendHeaders,
        },
    )
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
        `http://${flexSykmeldingerHostname}/api/v1/sykmeldinger/${sykmeldingId}/send`,
        {
            method: 'POST',
            headers: backendHeaders,
            body: JSON.stringify(sendSykmeldingValuesPostMapping),
        },
    )
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

export const sendSykmeldingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const pathSegments = req.query.path as string[] | undefined
    const uuid = pathSegments?.[3]

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

            const sendSykmeldingValues = await parseJsonBody<SendSykmeldingValues>(req)

            const sykmeldingen = await getSykmelding(uuid, req, oboToken)

            const brukerinformasjon = await getBrukerinformasjonById(uuid, req, oboToken)

            const erUtenforVentetid = await getErUtenforVentetidResponse(uuid, req, oboToken)

            const sendSykmeldingValuesPostMapping = mapSendSykmeldingValuesToV3Api(
                sendSykmeldingValues,
                sykmeldingen,
                brukerinformasjon,
                erUtenforVentetid,
            )

            const sendSykmeldingResponse = await sendSykmelding(uuid, sendSykmeldingValuesPostMapping, req, oboToken)

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
