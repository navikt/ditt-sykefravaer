import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { v4 } from 'uuid'

import { isValidScenario } from '../data/mock/mock-db/scenarios'
import mockDb from '../data/mock/mock-db'

import { ServerSidePropsResult } from './beskyttetSide'

export function handleMockContext(
    context: GetServerSidePropsContext,
    handler: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<ServerSidePropsResult>>,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> {
    const scenario = context.query.scenario as string | undefined
    const antallArbeidsgivere = context.query.antallArbeidsgivere as string | undefined
    const utenforVentetid = context.query.utenforVentetid as string | undefined
    const oppfolgingsdato = context.query.oppfolgingsdato as string | undefined

    if (isValidScenario(scenario) || antallArbeidsgivere || utenforVentetid || oppfolgingsdato) {
        const newId = v4()
        context.res.setHeader('set-cookie', `next-session-id=${newId}; Path=/`)

        if (isValidScenario(scenario)) {
            mockDb().set(newId, scenario)
        } else {
            mockDb().set(newId, 'normal')
        }

        if (antallArbeidsgivere) {
            mockDb().get(newId).setAntallArbeidsgivere(+antallArbeidsgivere)
            mockDb()
                .get(newId)
                .setErUtenforVentetid(utenforVentetid === 'true')
            mockDb()
                .get(newId)
                .setOppfolgingsdato(oppfolgingsdato ?? '')
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
