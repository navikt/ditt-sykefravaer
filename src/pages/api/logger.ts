import type { NextApiRequest, NextApiResponse } from 'next'
import pino from 'pino'

import { logger } from '../../utils/logger'

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    const { level, ts, ...rest }: pino.LogEvent = req.body

    rest.messages.forEach((msg) => {
        const log = typeof msg === 'string' ? { msg } : msg
        logger[ level.label ]({ ...log, isFrontend: true, x_userAgent: req.headers[ 'user-agent' ] })
    })

    res.status(200).json({ ok: 'ok' })
}

export default handler
