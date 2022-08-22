import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const motebehov = await tokenXProxy({
        url: `${serverRuntimeConfig.syfomotebehovUrl}/syfomotebehov/api/v3/arbeidstaker/motebehov`,
        method: 'GET',
        req: req,
        clientId: serverRuntimeConfig.syfomotebehovClientId,
    })

    res.status(200).json(motebehov)
})

export default handler
