import { NextApiRequest, NextApiResponse } from 'next'

import { handterPdfFeil, sendPdfResponse } from '../../utils/pdfUtils'
import { validateSykmeldingId } from '../../utils/sykmeldingUtils'

import { generateSykmeldingPdfServerSide } from './pdf'

const sendSykmeldingPdf = async (req: NextApiRequest, res: NextApiResponse) => {
    const sykmeldingId = validateSykmeldingId(req.query.sykmeldingId)

    try {
        const pdfBuffer = await generateSykmeldingPdfServerSide(req, sykmeldingId)
        await sendPdfResponse(res, pdfBuffer, 'sykmelding.pdf')
    } catch (feil) {
        handterPdfFeil(res, sykmeldingId, feil)
    }
}

export default sendSykmeldingPdf
