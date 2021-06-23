import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import env from '../../utils/environment'
import { enNyTilGodkjenning } from './data/oppfolginsplanTestPersoner'
import { Persona } from './data/persona'
import { defaultPersona, enAvvistSykmelding, enNySykmelding, heltFrisk } from './data/personas'

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: MiddlewareUtils.combine(
        MiddlewareUtils.loggingMiddleware()
    )
})


function setUpMock(persona: Persona) {
    mock.get(`${env.flexGatewayRoot}/syfosoknad/api/soknader`,
        (req, res, ctx) => res(ctx.json(persona.soknader)))

    mock.get(`${env.flexGatewayRoot}/syfosoknad/api/syfosyketilfelle/39ukersvarsel`,
        (req, res, ctx) => res(ctx.json(persona.snartSluttSykepenger)))

    mock.get(`${env.flexGatewayRoot}/veilarboppfolging/api/oppfolging`,
        (req, res, ctx) => res(ctx.json(persona.arbeidsrettetOppfolging)))

    mock.get(`${env.flexGatewayRoot}/spinnsyn-backend/api/v2/vedtak`,
        (req, res, ctx) => res(ctx.json(persona.vedtak)))

    mock.get(`${env.syfoApiRoot}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
        (req, res, ctx) => res(ctx.json(persona.oppfolgingsplaner)))

    mock.get(`${env.sykmeldingerBackendProxyRoot}/api/v1/sykmeldinger`,
        (req, res, ctx) => res(ctx.json(persona.sykmeldinger)))

    mock.get(`${env.narmestelederUrl}/user/sykmeldt/narmesteledere`,
        (req, res, ctx) => res(ctx.json(persona.narmesteledere)))

    mock.post(`${env.narmestelederUrl}/:org/avkreft`,
        () => Promise.resolve({ status: 200 }))
}

const url = new URL(window.location.href)

export interface StringFunctionMap {
    [ index: string ]: () => Persona;
}


const personas: StringFunctionMap = {
    'helt-frisk': () => heltFrisk,
    'en-ny-sykmelding': () => enNySykmelding,
    'en-avvist-sykmelding': () => enAvvistSykmelding,
    'en-oppfolgingsplan-til-godkjenning': enNyTilGodkjenning,
}

const testperson = url.searchParams.get('testperson')
if (testperson && Object.prototype.hasOwnProperty.call(personas, testperson)) {
    setUpMock(personas[ testperson ]())
} else {
    setUpMock(defaultPersona)
}
