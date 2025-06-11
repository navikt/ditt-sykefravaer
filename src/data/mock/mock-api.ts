import { ServerResponse } from 'http'
import { Readable } from 'stream'

import { serialize } from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { logger } from '@navikt/next-logger'
import { nextleton } from 'nextleton'
import { stream2buffer } from '@navikt/next-api-proxy/dist/proxyUtils'

import { cleanPathForMetric } from '../../metrics'
import { getSessionId } from '../../utils/userSessionId'
import { SendSykmeldingValues, SykmeldingChangeStatus } from '../../fetching/graphql.generated'
import { validerSykmeldingIdFraRequest } from '../../utils/sykmeldingUtils'
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = `${req.method} ${cleanPathForMetric(req.url!).split('?')[0]}`
    const testperson = hentTestperson(req, res)
    const nokkelKey = nokkel(req)
    const sessionId = getSessionId(req)

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

    const erClsTestperson = nokkelKey === 'cummulative-layout-shift'
    switch (url) {
        case 'GET /api/sykepengesoknad-backend/api/v2/soknader/metadata':
            if (erClsTestperson) await sleep(500)
            return sendJson(testperson.soknader)

        case 'GET /api/sykmeldinger-backend/api/v2/sykmeldinger':
            if (erClsTestperson) await sleep(1000)
            return sendJson(testperson.sykmeldinger)

        case 'GET /api/ditt-sykefravaer-backend/api/v1/meldinger':
            if (erClsTestperson) await sleep(750)
            return sendJson(testperson.meldinger)

        case 'GET /api/ditt-sykefravaer-backend/api/v1/inntektsmeldinger':
            if (erClsTestperson) await sleep(750)
            return sendJson(testperson.inntektsmeldinger || [])

        case 'POST /api/ditt-sykefravaer-backend/api/v1/meldinger/[uuid]/lukk':
            return sendJson({ lukket: 'ok' })

        case 'GET /api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging':
            return sendJson(testperson.arbeidsrettetOppfolging)

        case 'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger':
            return sendJson(mockDb().get(sessionId).sykmeldinger())

        case 'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]':
            return sendJson(mockDb().get(sessionId).sykmelding(pathNumber(3)!))

        case 'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]/brukerinformasjon':
            return sendJson(mockDb().get(sessionId).brukerinformasjon())

        case 'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]/tidligere-arbeidsgivere':
            return sendJson(mockDb().get(sessionId).tidligereArbeidsgivere())

        case 'GET /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]/er-utenfor-ventetid':
            return sendJson(mockDb().get(sessionId).sykeldingErUtenforVentetid())

        case 'POST /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]/send': {
            const body = await parseRequest<SendSykmeldingValues>(req)
            return sendJson(mockDb().get(sessionId).sendSykmelding(pathNumber(3)!, body))
        }

        case 'POST /api/flex-sykmeldinger-backend/api/v1/sykmeldinger/[uuid]/change-status': {
            const body = await parseRequest<SykmeldingChangeStatus>(req)
            return sendJson(mockDb().get(sessionId).changeSykmeldingStatus(pathNumber(3)!, body))
        }

        case 'GET /api/sykepengedager-informasjon/api/v1/sykepenger/maxdate':
            return sendJson(testperson.maxdato)

        case 'GET /api/spinnsyn-backend/api/v3/vedtak':
            return sendJson(testperson.vedtak)

        case 'GET /api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner':
            if (erClsTestperson) await sleep(250)

            return sendJson(testperson.oppfolgingsplaner)

        case 'GET /api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov':
            return sendJson(testperson.dialogmoteBehov)

        case 'POST /api/flexjar-backend/api/v2/feedback':
            return sendJson({ id: uuidv4() }, 201)

        case 'PUT /api/flexjar-backend/api/v2/feedback/[uuid]':
            return sendJson({}, 204)

        case 'GET /api/narmesteleder/user/v2/sykmeldt/narmesteledere':
            return sendJson(testperson.narmesteledere)

        case 'POST /api/narmesteleder/v2/[orgnr]/avkreft':
            // For this route, additional logic is needed to simulate the backend call and handle the :org parameter
            // Using the commented code for a basic logic:
            const org = pathNumber(1)
            // eslint-disable-next-line no-console
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

        case 'GET /[uuid]/pdf':
            const sykmeldingId = validerSykmeldingIdFraRequest(req)
            if (!sykmeldingId) {
                logger.warn(`Mock API: PDF generation requested without sykmeldingId for URL: ${url}`)
                return sendJson({ error: 'Missing sykmelding ID' }, 400)
            }

            await sendSykmeldingPdf(req, res)
            return

        default:
            logger.error(`Ukjent api ${url}`)
            res.status(404)
            res.end('Ukjent api')
            break
    }
}
