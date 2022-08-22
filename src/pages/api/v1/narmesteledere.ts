import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const data = await tokenXProxy({
        url: 'http://narmesteleder.teamsykmelding/user/v2/sykmeldt/narmesteledere',
        method: 'GET',
        req: req,
        clientId: serverRuntimeConfig.narmestelederClientId,
    })

    res.status(200).json(data)
})

export default handler
