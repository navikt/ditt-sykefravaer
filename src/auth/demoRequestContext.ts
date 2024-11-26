import { GetServerSidePropsContext, NextApiRequest } from 'next'

import { RequestContext } from '../server/graphql/resolvers'
import { getSessionId } from '../utils/userSessionId'
import { isMockBackend } from '../utils/environment'

/**
 * Used locally or in demo environments to create a fake request context.
 */
export function createDemoRequestContext(req: GetServerSidePropsContext['req'] | NextApiRequest): RequestContext {
    if (!isMockBackend()) {
        throw new Error('createDemoRequestContext should only be used in local development or demo environments')
    }

    return {
        ...require('./fakeLocalAuthTokenSet.json'),
        requestId: 'not set',
        sessionId: getSessionId(req),
    }
}
