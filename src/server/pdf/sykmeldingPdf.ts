import { NextApiRequest, NextApiResponse } from 'next'

import { handterPdfFeil, sendPdfResponse } from '../../utils/pdfUtils'
import { validateSykmeldingId } from '../../utils/sykmeldingUtils'

import { generateSykmeldingPdfServerSide } from './pdf'

const sendSykmeldingPdf = async (req: NextApiRequest, res: NextApiResponse, sykmeldingId: string) => {
    const validatedSykmeldingId = validateSykmeldingId(sykmeldingId)

    try {
        const pdfBuffer = await generateSykmeldingPdfServerSide(req, validatedSykmeldingId)
        await sendPdfResponse(res, pdfBuffer, 'sykmelding.pdf')
    } catch (feil) {
        handterPdfFeil(res, validatedSykmeldingId, feil)
    }
}

export default sendSykmeldingPdf
