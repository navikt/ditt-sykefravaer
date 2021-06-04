import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import env from '../../utils/environment'
import { nyeVedtak } from './data/rs-vedtak'
import { soknader } from './data/soknader'

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: MiddlewareUtils.combine(
        MiddlewareUtils.loggingMiddleware()
    )
})

mock.get(`${env.flexGatewayRoot}/syfosoknad/api/soknader`,
    (req, res, ctx) => res(ctx.json(soknader)))

mock.get(`${env.flexGatewayRoot}/spinnsyn-backend/api/v2/vedtak`,
    (req, res, ctx) => res(ctx.json(nyeVedtak)))

mock.post(`${env.flexGatewayRoot}/spinnsyn-backend/api/v2/vedtak/:id/les`, () => Promise.resolve({ status: 200 }))

