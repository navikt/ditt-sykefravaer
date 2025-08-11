import { logger } from '@navikt/next-logger'
import { GetServerSidePropsContext } from 'next/types'
import { parse } from 'cookie'
import { IToggle } from '@unleash/nextjs'
import { GetServerSidePropsResult } from 'next'
import { getToken, validateIdportenToken } from '@navikt/oasis'

import { isMockBackend } from '../utils/environment'
import { getSession } from '../data/mock/mock-api'
import { getFlagsServerSide } from '../toggles/ssr'

import { handleMockContext } from './mock-context'

type PageHandler = (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<ServerSidePropsResult>>

export interface ServerSidePropsResult {
    toggles: IToggle[]
}

function beskyttetSide(handler: PageHandler) {
    return async function withBearerTokenHandler(
        context: GetServerSidePropsContext,
    ): Promise<ReturnType<typeof handler>> {
        if (isMockBackend()) {
            const rawCookies = context.req?.headers.cookie || ''
            const parsedCookies = parse(rawCookies)
            getSession(parsedCookies, context.res)
            return handleMockContext(context, handler)
        }

        const request = context.req

        if (request == null) {
            throw new Error('Context is missing request. This should not happen')
        }
        if (request.url == null) {
            throw new Error('request.url is missing request. This should not happen')
        }
        const wonderwallRedirect = {
            redirect: {
                destination: '/oauth2/login?redirect=/syk/sykefravaer',
                permanent: false,
            },
        }

        const token = getToken(context.req)
        if (token == null) {
            return wonderwallRedirect
        }

        const validationResult = await validateIdportenToken(token)
        if (!validationResult.ok) {
            const error = new Error(
                `Invalid JWT token found (cause: ${validationResult.error.message}, redirecting to login.`,
                { cause: validationResult.error },
            )

            if (validationResult.errorType === 'token expired') {
                logger.warn(error)
            } else {
                logger.error(error)
            }

            return wonderwallRedirect
        }

        return handler(context)
    }
}

export const beskyttetSideUtenProps = beskyttetSide(async (context): Promise<{ props: ServerSidePropsResult }> => {
    const flags = await getFlagsServerSide(context)
    return {
        props: { toggles: flags.toggles },
    }
})
