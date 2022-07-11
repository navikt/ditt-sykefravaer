import { IncomingMessage } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import onHeaders from 'on-headers'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { getTokenxToken } from '../../../auth/getTokenxToken'
import { ErrorMedStatus } from '../../../server-utils/ErrorMedStatus'

const { serverRuntimeConfig } = getConfig()

const hentSykmeldingerFraSykmeldingerBackend = async (
    incomingMessage: IncomingMessage
): Promise<any[]> => {
    const idportenToken = incomingMessage.headers.authorization!.split(' ')[1]
    const tokenxToken = await getTokenxToken(
        idportenToken,
        serverRuntimeConfig.sykmeldinerBackendClientId
    )
    const url = 'http://sykmeldinger-backend.teamsykmelding/api/v2/sykmeldinger'
    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenxToken}` },
    })

    if (response.status != 200) {
        throw new ErrorMedStatus('Ikke 200 svar fra sykmeldinger-backend', 500)
    }
    return await response.json()
}

const handler = beskyttetApi(
    async (req: NextApiRequest, res: NextApiResponse) => {
        onHeaders(res, function () {
            this.setHeader(
                'Cache-Control',
                'no-cache, no-store, must-revalidate'
            )
            this.removeHeader('ETag')
        })
        if (req.method !== 'GET') {
            return res.status(404).json('Må være GET')
        }

        const sykmeldinger = await hentSykmeldingerFraSykmeldingerBackend(req)

        res.status(200).json(sykmeldinger)
    }
)

export default handler
