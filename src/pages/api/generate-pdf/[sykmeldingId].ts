import { NextApiRequest, NextApiResponse } from 'next'
import { logger } from '@navikt/next-logger'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import sendSykmeldingPdf from '../../../server/pdf/sykmeldingPdf'

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const sykmeldingId = req.query.sykmeldingId
    logger.info(
        `PDF for sykmeldingId: ${sykmeldingId}` + '. Params: ' + JSON.stringify(req.query) + '. Url: ' + req.url + '.',
    )
    if (typeof sykmeldingId !== 'string') {
        logger.warn(`Invalid sykmeldingId received: ${sykmeldingId}. Expected string.`)
        return res.status(400).json({ error: 'Invalid sykmelding ID provided.' })
    }

    if (req.method !== 'GET') {
        logger.warn(`Method Not Allowed: ${req.method} for sykmelding PDF generation.`)
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    await sendSykmeldingPdf(req, res)
})

export default handler
