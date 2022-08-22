import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const meldinger = await tokenXProxy({
        url: 'http://ditt-sykefravaer-backend/api/v1/meldinger',
        method: 'GET',
        req: req,
        clientId: serverRuntimeConfig.dittSykefravaerBackendClientId,
    })

    res.status(200).json(meldinger)
})

export default handler
