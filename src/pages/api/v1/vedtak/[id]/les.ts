import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import onHeaders from 'on-headers'

import { beskyttetApi } from '../../../../../auth/beskyttetApi'
import { getTokenxToken } from '../../../../../auth/getTokenxToken'
import { ErrorMedStatus } from '../../../../../server-utils/ErrorMedStatus'
import { isMockBackend } from '../../../../../utils/environment'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    onHeaders(res, function() {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        this.removeHeader('ETag')
    })
    if (req.method !== 'POST') {
        return res.status(404).json('Må være POST')

    }
    const id = req.query.id as string
    if (isMockBackend()) {
        res.setHeader('Set-Cookie', serialize(`lest-vedtak-${id}`, id, {
            path: '/syk/sykepenger/api',
            httpOnly: true,
            maxAge: 10,
        }))
        res.status(200).json({ ok: 'ok' })
        return
    }
    const idportenToken = req.headers.authorization!.split(' ')[ 1 ]
    const tokenxToken = await getTokenxToken(idportenToken, serverRuntimeConfig.spinnsynBackendTokenxClientId)
    const response = await fetch(`${serverRuntimeConfig.spinnsynBackendUrl}/api/v3/vedtak/${id}/les`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokenxToken}` }
    })

    if (response.status != 200) {
        throw new ErrorMedStatus('Ikke 200 svar fra spinnsyn-backend', 500)
    }
    res.status(200).json({ ok: 'ok' })
})

export default handler
