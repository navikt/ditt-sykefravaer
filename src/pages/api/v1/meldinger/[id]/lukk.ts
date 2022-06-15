import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import onHeaders from 'on-headers'

import { beskyttetApi } from '../../../../../auth/beskyttetApi'
import { getTokenxToken } from '../../../../../auth/getTokenxToken'
import { ErrorMedStatus } from '../../../../../server-utils/ErrorMedStatus'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        onHeaders(res, function () {
            this.setHeader(
                'Cache-Control',
                'no-cache, no-store, must-revalidate'
            )
            this.removeHeader('ETag')
        })
        if (req.method !== 'POST') {
            return res.status(404).json('Må være POST')
        }
        const id = req.query.id as string

        const idportenToken = req.headers.authorization!.split(' ')[1]
        const tokenxToken = await getTokenxToken(
            idportenToken,
            serverRuntimeConfig.dittSykefravaerBackendClientId
        )
        const response = await fetch(
            `http://ditt-sykefravaer-backend/api/v1/meldinger/${id}/lukk`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${tokenxToken}` },
            }
        )

        if (response.status != 200) {
            throw new ErrorMedStatus(
                'Ikke 200 svar fra ditt-sykefravaer-backend',
                500
            )
        }
        res.status(200).json({ ok: 'ok' })
    }
)

export default handler
