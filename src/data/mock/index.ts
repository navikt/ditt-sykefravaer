import dayjs from 'dayjs'
import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import { flexGatewayRoot, isOpplaering, narmestelederUrl,syfoApiRoot, sykmeldingerBackendProxyRoot } from '../../utils/environment'
import { Persona } from './data/persona'
import { defaultPersona } from './data/personas'
import { personas } from './testperson'

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: isOpplaering()
        ? MiddlewareUtils.combine(
            MiddlewareUtils.delayMiddleware(1000),
        )
        : MiddlewareUtils.combine(
            MiddlewareUtils.loggingMiddleware(),
        )
})

function setUpMock(persona: Persona) {
    mock.get(`${flexGatewayRoot()}/syfosoknad/api/soknader`,
        (req, res, ctx) => res(ctx.json(persona.soknader)))

    mock.get(`${syfoApiRoot()}/syfomotebehov/api/esyfovarsel/39uker`,
        (req, res, ctx) => res(ctx.json(persona.snartSluttSykepenger)))

    mock.get(`${flexGatewayRoot()}/veilarboppfolging/api/oppfolging`,
        (req, res, ctx) => res(ctx.json(persona.arbeidsrettetOppfolging)))

    mock.get(`${flexGatewayRoot()}/spinnsyn-backend/api/v2/vedtak`,
        (req, res, ctx) => res(ctx.json(persona.vedtak)))

    mock.get(`${syfoApiRoot()}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
        (req, res, ctx) => res(ctx.json(persona.oppfolgingsplaner)))

    mock.get(`${syfoApiRoot()}/syfomoteadmin/api/bruker/arbeidstaker/moter/siste`,
        (req, res, ctx) => res(ctx.json(persona.dialogmote)))

    mock.get(`${flexGatewayRoot()}/isdialogmote/api/v1/arbeidstaker/brev`,
        (req, res, ctx) => res(ctx.json(persona.brev)))

    mock.get(`${syfoApiRoot()}/syfomotebehov/api/v2/arbeidstaker/motebehov`,
        (req, res, ctx) => res(ctx.json(persona.dialogmoteBehov)))

    mock.get(`${sykmeldingerBackendProxyRoot()}/api/v1/sykmeldinger`,
        (req, res, ctx) => res(ctx.json(persona.sykmeldinger)))

    mock.get(`${narmestelederUrl()}/user/sykmeldt/narmesteledere`,
        (req, res, ctx) => res(ctx.json(persona.narmesteledere)))

    mock.post(`${narmestelederUrl()}/:org/avkreft`, (req) => {
        const idx = persona.narmesteledere.findIndex((nl) =>
            nl.orgnummer === req.queryParams.org
        )
        const nl = persona.narmesteledere.splice(idx, 1)[0]
        persona.narmesteledere.push({
            ...nl,
            aktivTom: dayjs().format('YYYY-MM-DD')
        })

        return Promise.resolve({ status: 200 })
    })

    mock.get(`${flexGatewayRoot()}/syfosoknad/api/sykeforloep`,
        (req, res, ctx) => res(ctx.json(persona.sykeforloep)))

    mock.get(`${syfoApiRoot()}/syfoservicestrangler/api/hendelse/hendelser`,
        (req, res, ctx) => res(ctx.json(persona.hendelser)))

    mock.post(`${syfoApiRoot()}/syfoservicestrangler/api/hendelse/bekreft-aktivitetskrav`, () => {
        persona.hendelser.push({ type: 'AKTIVITETSKRAV_BEKREFTET', inntruffetdato: dayjs().format('YYYY-MM-DD') })
        return Promise.resolve({ status: 200 })
    })

    mock.get('https://www.nav.no/person/innloggingsstatus/auth', (req, res, ctx) =>
        res(ctx.json({}))
    )
}

const url = new URL(window.location.href)

const testperson = url.searchParams.get('testperson')
if (testperson && Object.prototype.hasOwnProperty.call(personas, testperson)) {
    setUpMock(personas[testperson]())
} else {
    setUpMock(defaultPersona)
}
