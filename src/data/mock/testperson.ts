import { manglerInntektsmelding, mottattInntektsmelding } from './data/inntektsmeldingTestPersoner'
import {
    enNyOppfolgingsplan,
    enNyTilGodkjenning,
    toNyeOppfolgingsplaner,
    toTilGodkjenning,
} from './data/oppfolginsplanTestPersoner'
import { Persona } from './data/persona'
import { commonPersona, defaultPersona, enAvvistSykmelding, enNySykmelding, kunEnSoknad } from './data/personas'
import { forskutererIkke, snartSlutt } from './data/sykeforloepTestPersoner'

export interface StringFunctionMap {
    [index: string]: () => Persona
}

export const personas: StringFunctionMap = {
    default: () => defaultPersona,
    'helt-frisk': () => commonPersona(),
    'en-ny-sykmelding': () => enNySykmelding,
    'en-avvist-sykmelding': () => enAvvistSykmelding,
    'en-ny-oppfolgingsplan': enNyOppfolgingsplan,
    'to-nye-oppfolgingsplaner': toNyeOppfolgingsplaner,
    'en-ny-oppfolgingsplan-til-godkjenning': enNyTilGodkjenning,
    'to-nye-oppfolgingsplaner-til-godkjenning': toTilGodkjenning,
    'snart-slutt': snartSlutt,
    'arbeidsgiver-forskuterer-ikke': forskutererIkke,
    'mangler-inntektsmelding': () => manglerInntektsmelding(),
    'mottatt-inntektsmelding': () => mottattInntektsmelding(),
    'kun-en-soknad': () => kunEnSoknad(),
}
