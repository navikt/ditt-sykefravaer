import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { v4 } from 'uuid'
import { logger } from '@navikt/next-logger'

import { isValidScenario } from '../data/mock/mock-db/scenarios'
import mockDb from '../data/mock/mock-db'

import { ServerSidePropsResult } from './beskyttetSide'

export function handleMockContext(
    context: GetServerSidePropsContext,
    handler: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<ServerSidePropsResult>>,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> {
    const scenario = context.query.scenario as string | undefined
    const antallArbeidsgivere = context.query.antallArbeidsgivere as string | undefined
    const erUtenforVentetid = context.query.erUtenforVentetid as string | undefined
    const erForsteSykmelding = context.query.erForsteSykmelding as string | undefined

    logger.info(
        `Setting up mock context, scenario: ${scenario}, antallArbeidsgivere: ${antallArbeidsgivere}, erUtenforVentetid: ${erUtenforVentetid} erForsteSykmelding: ${erForsteSykmelding}`,
    )

    if (isValidScenario(scenario) || antallArbeidsgivere || erUtenforVentetid || erForsteSykmelding) {
        const newId = v4()
        context.res.setHeader('set-cookie', `next-session-id=${newId}; Path=/`)

        if (isValidScenario(scenario)) {
            mockDb().set(newId, scenario)
        } else {
            mockDb().set(newId, 'normal')
        }

        if (antallArbeidsgivere) {
            mockDb().get(newId).setAntallArbeidsgivere(+antallArbeidsgivere)
        }
        if (erUtenforVentetid !== undefined) {
            mockDb()
                .get(newId)
                .setErUtenforVentetid(erUtenforVentetid === 'true')
        }
        if (erForsteSykmelding !== undefined) {
            mockDb()
                .get(newId)
                .setErForsteSykmelding(erForsteSykmelding === 'true')
        }
    } else if (!context.req.cookies['next-session-id']) {
        const newId = v4()
        context.res.setHeader('set-cookie', `next-session-id=${newId}; Path=/`)
    }

    return handler(context)
}

export interface RequestContext {
    pid: string
    accessToken: string
    requestId: string
    sessionId: string
}
