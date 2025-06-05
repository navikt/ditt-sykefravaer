import { NextApiResponse } from 'next'
import { logger } from '@navikt/next-logger'

import { ApiError } from '../server/pdf/pdf'

export const sendPdfResponse = async (res: NextApiResponse, pdfBuffer: Buffer, filename = 'dokument.pdf') => {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    res.end(pdfBuffer)
}

export const handterPdfFeil = (res: NextApiResponse, dokumentId: string | string[], feil: unknown): void => {
    if (feil instanceof ApiError) {
        logger.error(
            `API Feil ved generering av PDF for dokumentId ${dokumentId}: ${feil.message} (Status: ${feil.statusCode})`,
            feil.cause,
        )
        res.status(feil.statusCode).json({ error: feil.message })
    } else if (feil instanceof Error) {
        logger.error(`Uventet feil ved generering av PDF for dokumentId ${dokumentId}: ${feil.message}`, feil)
        res.status(500).json({ error: 'Intern serverfeil.' })
    } else {
        logger.error(`Ukjent feiltype ved generering av PDF for dokumentId ${dokumentId}:`, feil)
        res.status(500).json({ error: 'En ukjent feil oppstod.' })
    }
}
