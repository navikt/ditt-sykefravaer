import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../../../auth/beskyttetApi'
import { tokenXProxy } from '../../../../../auth/tokenXProxy'

const { serverRuntimeConfig } = getConfig()

const handler = beskyttetApi(
    async (req: NextApiRequest, res: NextApiResponse) => {
        const brev = await tokenXProxy({
            url: 'http://isdialogmote.teamsykefravr/api/v2/arbeidstaker/brev',
            method: 'GET',
            req: req,
            clientId: serverRuntimeConfig.isdialogmoteClientId,
        })

        res.status(200).json(brev)
    }
)

export default handler
