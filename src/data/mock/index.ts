import dayjs from 'dayjs'
import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import { isOpplaering } from '../../utils/environment'
import { Persona } from './data/persona'
import { defaultPersona } from './data/personas'
import { personas } from './testperson'

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: isOpplaering()
        ? MiddlewareUtils.combine(MiddlewareUtils.delayMiddleware(500))
        : MiddlewareUtils.combine(MiddlewareUtils.loggingMiddleware()),
})

function setUpMock(persona: Persona) {
    mock.get('/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/meldinger', (req, res, ctx) =>
        res(ctx.json(persona.meldinger))
    )

    mock.post('/syk/sykefravaer/ditt-sykefravaer-backend/api/v1/meldinger/:id/lukk', (req, res, ctx) =>
        res(ctx.json({ lukket: 'ok' }))
    )

    mock.get('/syk/sykefravaer/api/sykepengesoknad-backend/api/v2/soknader', (req, res, ctx) =>
        res(ctx.json(persona.soknader))
    )

    mock.get('/syk/sykefravaer/api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging', (req, res, ctx) =>
        res(ctx.json(persona.arbeidsrettetOppfolging))
    )

    mock.get('/syk/sykefravaer/api/spinnsyn-backend/api/v3/vedtak', (req, res, ctx) => res(ctx.json(persona.vedtak)))

    mock.get(
        '/syk/sykefravaer/api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner',
        (req, res, ctx) => res(ctx.json(persona.oppfolgingsplaner))
    )

    mock.get('/syk/sykefravaer/api/isdialogmote/api/v2/arbeidstaker/brev', (req, res, ctx) =>
        res(ctx.json(persona.brev))
    )

    mock.get('/syk/sykefravaer/api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov', (req, res, ctx) =>
        res(ctx.json(persona.dialogmoteBehov))
    )

    mock.get('/syk/sykefravaer/api/sykmeldinger-backend/api/v2/sykmeldinger', (req, res, ctx) =>
        res(ctx.json(persona.sykmeldinger))
    )

    mock.get('/syk/sykefravaer/api/narmesteleder/user/v2/sykmeldt/narmesteledere', (req, res, ctx) =>
        res(ctx.json(persona.narmesteledere))
    )

    mock.post('/syk/sykefravaer/api/narmesteleder/v2/:org/avkreft', (req) => {
        const idx = persona.narmesteledere.findIndex((nl) => nl.orgnummer === req.pathParams.org)
        const avkreftetLeder = persona.narmesteledere[idx]
        persona.narmesteledere.splice(idx, 1, {
            ...avkreftetLeder,
            aktivTom: dayjs().format('YYYY-MM-DD'),
        })

        return Promise.resolve({ status: 200 })
    })

    mock.get('https://www.nav.no/person/innloggingsstatus/auth', (req, res, ctx) => res(ctx.json({})))
}

const url = new URL(window.location.href)

const testperson = url.searchParams.get('testperson')
if (testperson && Object.prototype.hasOwnProperty.call(personas, testperson)) {
    setUpMock(personas[testperson]())
} else {
    setUpMock(defaultPersona)
}
