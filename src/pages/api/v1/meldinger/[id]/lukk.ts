import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await tokenXProxy({
        url: `http://ditt-sykefravaer-backend/api/v1/meldinger/${req.query.id}/lukk`,
        method: 'POST',
        req: req,
        clientId: serverRuntimeConfig.dittSykefravaerBackendClientId,
        noResponse: true,
    })

    res.status(200).json({ ok: 'ok' })
})

export default handler
