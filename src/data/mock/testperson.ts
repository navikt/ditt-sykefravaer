import {
    manglerInntektsmelding,
    mottattInntektsmelding,
} from './data/inntektsmeldingTestPersoner'
import {
    enNyOppfolgingsplan,
    enNyTilGodkjenning,
    toNyeOppfolgingsplaner,
    toTilGodkjenning,
} from './data/oppfolginsplanTestPersoner'
import { Persona } from './data/persona'
import {
    commonPersona,
    defaultPersona,
    enAvvistSykmelding,
    enNySykmelding,
} from './data/personas'
import {
    langtidssykmeldt,
    snartSlutt,
    tvingMindreEnnTrettiniUker,
} from './data/sykeforloepTestPersoner'

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
    langtidssykmeldt: langtidssykmeldt,
    'snart-slutt': snartSlutt,
    'tving-mindre-enn-trettini-uker': tvingMindreEnnTrettiniUker,
    'mangler-inntektsmelding': () => manglerInntektsmelding(),
    'mottatt-inntektsmelding': () => mottattInntektsmelding(),
}
