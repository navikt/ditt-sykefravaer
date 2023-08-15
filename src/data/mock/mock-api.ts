import { serialize } from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { logger } from '@navikt/next-logger'
import { nextleton } from 'nextleton'

import { cleanPathForMetric } from '../../metrics'

import { testpersoner } from './testperson'
import { Persona } from './data/persona'

type session = {
    expires: dayjs.Dayjs
    testpersoner: { [index: string]: Persona }
}
export const sessionStore = nextleton('sessionStore', () => {
    return {} as Record<string, session>
})

export function getSession(req: NextApiRequest, res: NextApiResponse): session {
    function getSessionId(): string {
        const sessionIdCookie = req.cookies['mock-session']
        if (sessionIdCookie) {
            return sessionIdCookie
        }
        const sessionId = uuidv4()
        const cookie = serialize('mock-session', sessionId, {
            httpOnly: false,
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000),
        })
        res.setHeader('Set-Cookie', cookie)

        return sessionId
    }

    const sessionId = getSessionId()

    if (!sessionStore[sessionId] || sessionStore[sessionId].expires.isBefore(dayjs())) {
        sessionStore[sessionId] = {
            expires: dayjs().add(1, 'hour'),
            testpersoner: testpersoner(),
        }
    }

    return sessionStore[sessionId]
}

export function hentTestperson(req: NextApiRequest, res: NextApiResponse): Persona {
    function nokkel(): string {
        const query = req.query['testperson']
        if (query) return query.toString()
        return 'default'
    }

    return getSession(req, res).testpersoner[nokkel()]
}

export async function mockApi(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = `${req.method} ${cleanPathForMetric(req.url!).split('?')[0]}`
    const testperson = hentTestperson(req, res)

    function sendJson(json = {}, status = 200) {
        res.writeHead(status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(json))
    }

    function pathNumber(n: number): string | null {
        if (req.query['path'] && req.query['path']?.[n]) {
            return req.query['path']?.[n]
        }
        return null
    }

    switch (url) {
        case 'GET /api/sykepengesoknad-backend/api/v2/soknader/metadata':
            return sendJson(testperson.soknader)

        case 'GET /api/sykmeldinger-backend/api/v2/sykmeldinger':
            return sendJson(testperson.sykmeldinger)

        case 'GET /api/ditt-sykefravaer-backend/api/v1/meldinger':
            return sendJson(testperson.meldinger)

        case 'POST /api/ditt-sykefravaer-backend/api/v1/meldinger/[uuid]/lukk':
            // Here we need more logic to handle the :id parameter, but for now:
            return sendJson({ lukket: 'ok' })

        case 'GET /api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging':
            return sendJson(testperson.arbeidsrettetOppfolging)

        case 'GET /api/spinnsyn-backend/api/v3/vedtak':
            return sendJson(testperson.vedtak)

        case 'GET /api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner':
            return sendJson(testperson.oppfolgingsplaner)

        case 'GET /api/isdialogmote/api/v2/arbeidstaker/brev':
            return sendJson(testperson.brev)

        case 'GET /api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov':
            return sendJson(testperson.dialogmoteBehov)

        case 'GET /api/narmesteleder/user/v2/sykmeldt/narmesteledere':
            return sendJson(testperson.narmesteledere)

        case 'POST /api/narmesteleder/v2/[:orgnr]/avkreft':
            // For this route, additional logic is needed to simulate the backend call and handle the :org parameter
            // Using the commented code for a basic logic:
            const org = pathNumber(4)
            // eslint-disable-next-line no-console
            console.log(org)
            if (org === '972674820') {
                res.status(500)
                res.end()
                return
            }
            const idx = testperson.narmesteledere.findIndex((nl) => nl.orgnummer === org)
            if (idx !== -1) {
                const avkreftetLeder = testperson.narmesteledere[idx]
                testperson.narmesteledere.splice(idx, 1, {
                    ...avkreftetLeder,
                    aktivTom: dayjs().format('YYYY-MM-DD'),
                })
            }
            return sendJson({ status: 200 })

        default:
            logger.error(`Ukjent api ${url}`)
            res.status(404)
            res.end('Ukjent api')
            break
    }
}
