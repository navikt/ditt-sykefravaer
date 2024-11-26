import { ApolloServer } from '@apollo/server'
import { logger } from '@navikt/next-logger'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

import schema from '../../server/graphql/schema'
import { RequestContext } from '../../server/graphql/resolvers'
import { createDemoRequestContext } from '../../auth/demoRequestContext'

const server = new ApolloServer<RequestContext>({
    schema,
    logger,
    introspection: false,
})

export default startServerAndCreateNextHandler(server, {
    context: async (req) => {
        return createDemoRequestContext(req)
    },
})
