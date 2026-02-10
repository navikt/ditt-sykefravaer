import { IncomingHttpHeaders } from 'http'

import { IToggle, getDefinitions, evaluateFlags, flagsClient } from '@unleash/nextjs'
import { logger } from '@navikt/next-logger'
import { GetServerSidePropsContext } from 'next/types'
import * as R from 'remeda'
import NodeCache from 'node-cache'

import { isMockBackend } from '../utils/environment'

import { getUnleashEnvironment, localDevelopmentToggles } from './utils'
import { EXPECTED_TOGGLES } from './toggles'

type UnleashClient = ReturnType<typeof flagsClient>

export async function getFlagsServerSide(
    context: Pick<GetServerSidePropsContext, 'req' | 'res' | 'query'>,
): Promise<{ toggles: IToggle[] }> {
    if (isMockBackend()) {
        logger.info('Running in local or demo mode, falling back to development toggles.')
        return { toggles: localDevelopmentToggles(context) }
    }

    try {
        const { userId } = handleUnleashIds(context.req, context.res)
        const definitions = await getAndValidateDefinitions()
        return evaluateFlags(definitions, {
            userId,
            environment: getUnleashEnvironment(),
        })
    } catch (e) {
        logger.error(new Error('Failed to get flags from Unleash. Falling back to default flags.', { cause: e }))
        return {
            toggles: EXPECTED_TOGGLES.map(
                (it): IToggle => ({
                    name: it,
                    variant: {
                        name: 'default',
                        enabled: false,
                    },
                    impressionData: false,
                    enabled: false,
                }),
            ),
        }
    }
}

export function createFlagsClient(flags: { toggles: IToggle[] }): UnleashClient {
    /**
     * Burde kun brukes server-side
     * Bruk sammen med checkToggleAndReportMetrics for å rapportere metrics tilbake til Unleash
     */
    if (isMockBackend()) {
        logger.info('Running in local or demo mode, will not report Unleash metrics')
        return flagsClient(flags.toggles)
    }
    const unleashServerUrl = process.env.UNLEASH_SERVER_API_URL
        ? `${process.env.UNLEASH_SERVER_API_URL}/api`
        : undefined
    if (!unleashServerUrl) {
        logger.warn("Missing env var UNLEASH_SERVER_API_URL, can't send Unleash metrics")
    }
    try {
        return flagsClient(flags.toggles, {
            url: unleashServerUrl,
        })
    } catch (e) {
        logger.error("Failed to set up Unleash for metrics reporting, can't send Unleash metrics", e)
        return flagsClient(flags.toggles)
    }
}

export function checkToggleAndReportMetrics(client: UnleashClient, toggleName: string): boolean {
    const enabled = client.isEnabled(toggleName)
    if (isMockBackend()) {
        return enabled
    }
    client.sendMetrics().catch((err) => {
        logger.warn(new Error('Tried to report Unleash metrics, but failed', { cause: err }))
    })
    return enabled
}

const unleashCache = new NodeCache({ stdTTL: 15 })

/**
 * If there are any toggles defined in EXPECTED_TOGGLES that are not returned by Unleash, something is out of sync.
 */
async function getAndValidateDefinitions(): Promise<ReturnType<typeof getDefinitions>> {
    if (unleashCache.has('toggles')) {
        const cachedToggles = unleashCache.get<ReturnType<typeof getDefinitions>>('toggles')
        if (cachedToggles != null) {
            logger.info('Using cached unleash definitions')
            return cachedToggles
        }
    }
    const definitions = await getDefinitions({
        url: process.env.UNLEASH_SERVER_API_URL + '/api/client/features',
        token: process.env.UNLEASH_SERVER_API_TOKEN,
        appName: 'ditt-sykefravaer-frontend',
    })

    unleashCache.set('toggles', definitions)

    const diff = R.difference(
        EXPECTED_TOGGLES,
        R.map(definitions.features, (it) => it.name),
    )

    if (diff.length > 0) {
        logger.error(
            `Difference in expected flags and flags in unleash, expected but not in unleash: ${diff.join(', ')}`,
        )
    }

    logger.info(
        `Fetched ${definitions.features.length} flags from unleash: ${definitions.features
            .map((it) => it.name)
            .join('\n')}\n`,
    )

    return definitions
}

const unleashCookieName = 'sykepengesoknad-frontend-unleash-session-id'

function handleUnleashIds(
    req: GetServerSidePropsContext['req'],
    res: GetServerSidePropsContext['res'],
): {
    userId: string | undefined
} {
    const pid = parseAuthHeader(req.headers)?.pid ?? undefined

    const harGammelUnleashCookie = req.cookies[unleashCookieName]
    if (harGammelUnleashCookie != null) {
        // Delete the old cookie
        res.setHeader('set-cookie', `${unleashCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    }
    return {
        userId: pid,
    }
}

function parseAuthHeader(headers: IncomingHttpHeaders): TokenPayload | null {
    if (!headers.authorization) return null

    const accessToken = headers.authorization.replace('Bearer ', '')
    const jwtPayload = accessToken.split('.')[1]

    return JSON.parse(Buffer.from(jwtPayload, 'base64').toString())
}

interface TokenPayload {
    sub: string
    iss: string
    client_amr: string
    pid: string
    token_type: string
    client_id: string
    acr: string
    scope: string
    exp: string
    iat: string
    client_orgno: string
    jti: string
    consumer: {
        authority: string
        ID: string
    }
}
