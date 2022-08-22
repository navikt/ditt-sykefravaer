import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const vedtak = await tokenXProxy({
        url: 'http://spinnsyn-backend/api/v3/vedtak',
        method: 'GET',
        req: req,
        clientId: serverRuntimeConfig.spinnsynBackendClientId,
    })

    res.status(200).json(vedtak)
})

export default handler
