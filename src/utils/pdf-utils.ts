import { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@navikt/next-logger'

import { ApiError, generateSykmeldingPdfServerSide } from '../server/pdf/pdf'

export const sendPdfResponse = async (req: NextApiRequest, res: NextApiResponse) => {
    const pdfBuffer = await generateSykmeldingPdfServerSide(req)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="sykmelding.pdf"')
    res.end(pdfBuffer)
}

export const handlePdfError = (res: NextApiResponse, sykmeldingId: string | string[], error: unknown): void => {
    if (error instanceof ApiError) {
        logger.error(
            `API Error generating PDF for sykmeldingId ${sykmeldingId}: ${error.message} (Status: ${error.statusCode})`,
            error.cause,
        )
        res.status(error.statusCode).json({ error: error.message })
    } else if (error instanceof Error) {
        logger.error(`Unexpected error generating PDF for sykmeldingId ${sykmeldingId}: ${error.message}`, error)
        res.status(500).json({ error: 'Internal Server Error.' })
    } else {
        logger.error(`Unknown error type generating PDF for sykmeldingId ${sykmeldingId}:`, error)
        res.status(500).json({ error: 'An unknown error occurred.' })
    }
}
