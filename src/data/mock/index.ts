import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import env from '../../utils/environment'
import {
    enNyOppfolgingsplan,
    enNyTilGodkjenning,
    toNyeOppfolgingsplaner, toTilGodkjenning
} from './data/oppfolginsplanTestPersoner'
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

    mock.get(`${env.syfoApiRoot}/syfomoteadmin/api/bruker/arbeidstaker/moter/siste`,
        (req, res, ctx) => res(ctx.json(persona.dialogmote)))

    mock.get(`${env.syfoApiRoot}/syfomotebehov/api/v2/arbeidstaker/motebehov`,
        (req, res, ctx) => res(ctx.json(persona.dialogmoteBehov)))

    mock.get(`${env.sykmeldingerBackendProxyRoot}/api/v1/sykmeldinger`,
        (req, res, ctx) => res(ctx.json(persona.sykmeldinger)))

    mock.get(`${env.narmestelederUrl}/user/sykmeldt/narmesteledere`,
        (req, res, ctx) => res(ctx.json(persona.narmesteledere)))

    mock.post(`${env.narmestelederUrl}/:org/avkreft`,
        () => Promise.resolve({ status: 200 }))

    mock.get(`${env.flexGatewayRoot}/syfosoknad/api/sykeforloep`,
        (req, res, ctx) => res(ctx.json(persona.sykeforloep)))
}

const url = new URL(window.location.href)

export interface StringFunctionMap {
    [ index: string ]: () => Persona;
}


const personas: StringFunctionMap = {
    'helt-frisk': () => heltFrisk,
    'en-ny-sykmelding': () => enNySykmelding,
    'en-avvist-sykmelding': () => enAvvistSykmelding,
    'en-ny-oppfolgingsplan': enNyOppfolgingsplan,
    'to-nye-oppfolgingsplaner': toNyeOppfolgingsplaner,
    'en-ny-oppfolgingsplan-til-godkjenning': enNyTilGodkjenning,
    'to-nye-oppfolgingsplaner-til-godkjenning': toTilGodkjenning,
}

const testperson = url.searchParams.get('testperson')
if (testperson && Object.prototype.hasOwnProperty.call(personas, testperson)) {
    setUpMock(personas[ testperson ]())
} else {
    setUpMock(defaultPersona)
}
