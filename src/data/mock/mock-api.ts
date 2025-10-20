import { ServerResponse } from 'http'
import { Readable } from 'stream'

import { serialize } from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { logger } from '@navikt/next-logger'
import { nextleton } from 'nextleton'
import { stream2buffer } from '@navikt/next-api-proxy/dist/proxyUtils'
import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match'

import { getSessionId } from '../../utils/userSessionId'
import { SendSykmeldingValues, SykmeldingChangeStatus } from '../../fetching/graphql.generated'
import sendSykmeldingPdf from '../../server/pdf/sykmeldingPdf'

import mockDb from './mock-db'
import { Persona, testpersoner } from './testperson'

type session = {
    expires: dayjs.Dayjs
    testpersoner: { [index: string]: Persona }
}
export const sessionStore = nextleton('sessionStore', () => {
    return {} as Record<string, session>
})

export function getSession(
    cookies: Partial<{
        [key: string]: string
    }>,
    res?: ServerResponse,
): session {
    function getSessionId(): string {
        const sessionIdCookie = cookies['mock-session']
        if (sessionIdCookie) {
            return sessionIdCookie
        }
        const sessionId = uuidv4()
        const cookie = serialize('mock-session', sessionId, {
            httpOnly: false,
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000),
        })
        res?.setHeader('Set-Cookie', cookie)

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

function nokkel(req: NextApiRequest): string {
    const query = req.query['testperson']
    if (query) return query.toString()
    return 'default'
}

export function hentTestperson(req: NextApiRequest, res: NextApiResponse): Persona {
    return getSession(req.cookies, res).testpersoner[nokkel(req)]
}

async function parseRequest<T>(req: NextApiRequest): Promise<T> {
    const stream = Readable.from(req)
    const buffer = await stream2buffer(stream)
    const jsonString = buffer.toString()
    return JSON.parse(jsonString)
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockApi(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const testperson = hentTestperson(req, res)
    const nokkelKey = nokkel(req)
    const sessionId = getSessionId(req)

    function sendJson(json = {}, status = 200) {
        res.writeHead(status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(json))
    }

    const erClsTestperson = nokkelKey === 'cummulative-layout-shift'

    const routes: Record<string, (params: Record<string, string>) => Promise<void> | void> = {
        'GET /api/sykepengesoknad-backend/api/v2/soknader/metadata': async () => {
            if (erClsTestperson) await sleep(500)
            return sendJson(testperson.soknader)
        },
        'GET /api/ditt-sykefravaer-backend/api/v1/meldinger': async () => {
            if (erClsTestperson) await sleep(750)
            return sendJson(testperson.meldinger)
        },
        'GET /api/ditt-sykefravaer-backend/api/v1/inntektsmeldinger': async () => {
            if (erClsTestperson) await sleep(750)
            return sendJson(testperson.inntektsmeldinger || [])
        },
        'POST /api/ditt-sykefravaer-backend/api/v1/meldinger/:uuid/lukk': () => {
            return sendJson({ lukket: 'ok' })
        },
        'GET /api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging': () => {
            return sendJson(testperson.arbeidsrettetOppfolging)
        },
        'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger': () => {
            return sendJson(mockDb().get(sessionId).sykmeldinger())
        },
        'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid': (params) => {
            return sendJson(mockDb().get(sessionId).sykmelding(params.uuid))
        },
        'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid/brukerinformasjon': () => {
            return sendJson(mockDb().get(sessionId).brukerinformasjon())
        },
        'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid/tidligere-arbeidsgivere': () => {
            return sendJson(mockDb().get(sessionId).tidligereArbeidsgivere())
        },
        'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid/er-utenfor-ventetid': () => {
            return sendJson(mockDb().get(sessionId).sykeldingErUtenforVentetid())
        },
        'POST /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid/send': async (params) => {
            const body = await parseRequest<SendSykmeldingValues>(req)
            return sendJson(mockDb().get(sessionId).sendSykmelding(params.uuid, body))
        },
        'POST /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/:uuid/change-status': async (params) => {
            const body = await parseRequest<SykmeldingChangeStatus>(req)
            return sendJson(mockDb().get(sessionId).changeSykmeldingStatus(params.uuid, body))
        },
        'GET /api/sykepengedager-informasjon/api/v1/sykepenger/maxdate': () => {
            return sendJson(testperson.maxdato)
        },
        'GET /api/spinnsyn-backend/api/v3/vedtak': () => {
            return sendJson(testperson.vedtak)
        },
        'GET /api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner':
            async () => {
                if (erClsTestperson) await sleep(250)
                return sendJson(testperson.oppfolgingsplaner)
            },
        'POST /api/flexjar-backend/api/v2/feedback': () => {
            return sendJson({ id: uuidv4() }, 201)
        },
        'PUT /api/flexjar-backend/api/v2/feedback/:uuid': () => {
            return sendJson({}, 204)
        },
        'GET /api/narmesteleder/user/v2/sykmeldt/narmesteledere': () => {
            return sendJson(testperson.narmesteledere)
        },
        'POST /api/narmesteleder/v2/:orgnr/avkreft': (params) => {
            const org = params.orgnr
            if (org === '972674820') {
                res.status(500)
                res.end()
                return
            }
            const idx = testperson.narmesteledere.findIndex((nl) => nl.orgnummer === org)
            if (idx !== -1) {
                const avkreftetLeder = testperson.narmesteledere[idx]
                // Fjerner avkreftet leder fra mockdata.
                testperson.narmesteledere.splice(idx, 1, {
                    ...avkreftetLeder,
                    aktivTom: dayjs().format('YYYY-MM-DD'),
                })
            }
            return sendJson({ status: 200 })
        },
        'GET /:uuid/pdf': async (params) => {
            const sykmeldingId = params.uuid
            if (!sykmeldingId) {
                logger.warn(`Mock API: PDF generation requested without sykmeldingId for URL: ${req.url}`)
                return sendJson({ error: 'Missing sykmelding ID' }, 400)
            }
            await sendSykmeldingPdf(req, res)
            return
        },
    }

    const routeResult = await handleRoutes(req, routes)
    if (!routeResult) {
        logger.error(`Ukjent api ${req.url}`)
        res.status(404)
        res.end('Ukjent api')
    }
}

async function handleRoutes(
    req: { url?: string; method?: string },
    routes: Record<string, (params: Record<string, string>) => Promise<void> | void>,
): Promise<boolean> {
    for (const [route, handler] of Object.entries(routes)) {
        const params = requestMatches(req, route)
        if (params !== false) {
            await handler(params)
            return true
        }
    }
    return false
}

function requestMatches(req: { url?: string; method?: string }, route: string): Record<string, string> | false {
    const [expecteMethod, expectedPath] = route.split(' ')
    if (req.method !== expecteMethod) {
        return false
    }
    if (!req.url) {
        return false
    }
    const urlPath = extractUrlPath(req.url)
    const matcher = getPathMatch(expectedPath)
    return matcher(urlPath)
}

function extractUrlPath(url: string): string {
    return new URL(url, 'http://dummy').pathname
}
