import { GetServerSidePropsContext, NextApiRequest } from 'next'

import { getSessionId } from '../utils/userSessionId'
import { isMockBackend } from '../utils/environment'
import { RequestContext } from '../server/graphql/mockResolvers'

/**
 * Used locally or in demo environments to create a fake request context.
 */
export function createDemoRequestContext(req: GetServerSidePropsContext['req'] | NextApiRequest): RequestContext {
    if (!isMockBackend()) {
        throw new Error('createDemoRequestContext should only be used in local development or demo environments')
    }

    return {
        pid: '12345678910',
        accessToken: 'fake-token',
        requestId: 'not set',
        sessionId: getSessionId(req),
    }
}
