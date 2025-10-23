import { renderToBuffer } from '@react-pdf/renderer'
import { requestOboToken } from '@navikt/oasis'
import { NextApiRequest } from 'next'
import { logger } from '@navikt/next-logger'
import getConfig from 'next/config'

import { getSykmelding } from '../../pages/api/flex-sykmeldinger-backend/SendSykmeldingRequest'
import { MuterbarSykmelding } from '../api-models/sykmelding/MuterbarSykmelding'
import { isMockBackend } from '../../utils/environment'
import mockDb from '../../data/mock/mock-db'
import { getSessionId } from '../../utils/userSessionId'

import SykmeldingPdf from './components/SykmeldingPdf'

const { serverRuntimeConfig } = getConfig()

export class ApiError extends Error {
    statusCode: number
    constructor(
        statusCode: number,
        message: string,
        public cause?: Error,
    ) {
        super(message)
        this.statusCode = statusCode
        this.name = 'ApiError'
        Object.setPrototypeOf(this, ApiError.prototype)
    }
}

async function getOboTokenOrThrow(req: NextApiRequest, sykmeldingId: string): Promise<string> {
    logger.info('Non-mock environment: Attempting OBO token exchange.')
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        logger.warn('Authorization header missing or not Bearer token for generateSykmeldingPdfServerSide')
        throw new ApiError(401, 'Invalid or missing authorization header.')
    }
    const idPortenToken = authorizationHeader.split(' ')[1]

    try {
        const oboTokenResponse = await requestOboToken(
            idPortenToken,
            serverRuntimeConfig.flexSykmeldingerBackendClientId,
        )
        if (!oboTokenResponse.ok) {
            logger.error(
                `OBO token exchange failed for ${serverRuntimeConfig.flexSykmeldingerBackendClientId}: ${oboTokenResponse.error.message}`,
                oboTokenResponse.error,
            )
            throw new ApiError(502, 'Failed to authenticate with backend service (OBO).', oboTokenResponse.error)
        }
        logger.info(`Successfully obtained OBO token for sykmelding ID: ${sykmeldingId}`)
        return oboTokenResponse.token
    } catch (error) {
        logger.error(
            `Error during OBO token exchange for sykmelding ID ${sykmeldingId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error,
        )
        throw new ApiError(
            401,
            'Authentication failed during OBO token exchange.',
            error instanceof Error ? error : new Error(String(error)),
        )
    }
}

async function fetchSykmelding(
    req: NextApiRequest,
    sykmeldingId: string,
    oboToken?: string,
): Promise<MuterbarSykmelding> {
    if (!isMockBackend()) {
        return await getSykmelding(sykmeldingId, req, oboToken!)
    } else {
        logger.info('Local/Demo environment: Bypassing OBO token exchange and using mock sykmelding.')
        return mockDb().get(getSessionId(req)).sykmelding(sykmeldingId)
    }
}

async function generatePdfBuffer(sykmelding: MuterbarSykmelding, timestamp: string): Promise<Buffer> {
    return await renderToBuffer(<SykmeldingPdf sykmelding={sykmelding} timestamp={timestamp} />)
}

export const generateSykmeldingPdfServerSide = async (req: NextApiRequest, sykmeldingId: string): Promise<Buffer> => {
    let oboToken: string | undefined

    if (!isMockBackend()) {
        oboToken = await getOboTokenOrThrow(req, sykmeldingId)
    }

    const sykmelding = await fetchSykmelding(req, sykmeldingId, oboToken)
    const timestamp = new Date().toISOString()

    try {
        return await generatePdfBuffer(sykmelding, timestamp)
    } catch (error: unknown) {
        logger.error(
            `Error in generateSykmeldingPdfServerSide (rendering) for ${sykmeldingId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            {
                stack: error instanceof Error ? error.stack : 'No stack',
                cause: error instanceof Error ? error.cause : 'No cause',
            },
        )

        if (error instanceof ApiError) {
            throw error
        }

        if (error instanceof Error && error.message.toLowerCase().includes('invalid json body')) {
            throw new ApiError(400, 'Invalid JSON in request body.', error)
        }
        if (
            error instanceof Error &&
            (error.message.includes('Failed to fetch') || error.message.includes('Failed to send'))
        ) {
            throw new ApiError(502, 'Error communicating with backend service.', error)
        }

        throw new ApiError(
            500,
            'Internal server error while generating PDF (rendering stage).',
            error instanceof Error ? error : new Error(String(error)),
        )
    }
}
