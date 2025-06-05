import { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@navikt/next-logger'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { handlePdfError, sendPdfResponse } from '../../../utils/pdf-utils'

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const sykmeldingId = req.query.sykmeldingId
    if (typeof sykmeldingId !== 'string') {
        logger.warn(`Invalid sykmeldingId received: ${sykmeldingId}. Expected string.`)
        return res.status(400).json({ error: 'Invalid sykmelding ID provided.' })
    }

    if (req.method !== 'GET') {
        logger.warn(`Method Not Allowed: ${req.method} for sykmelding PDF generation.`)
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    try {
        await sendPdfResponse(req, res)
    } catch (error) {
        handlePdfError(res, sykmeldingId, error)
    }
})

export default handler
