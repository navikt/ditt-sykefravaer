import {
    enNyOppfolgingsplan,
    enNyTilGodkjenning,
    toNyeOppfolgingsplaner,
    toTilGodkjenning
} from './data/oppfolginsplanTestPersoner'
import { Persona } from './data/persona'
import { enAvvistSykmelding, enNySykmelding, heltFrisk } from './data/personas'
import { langtidssykmeldt, snartSlutt, tvingMindreEnnTrettiniUker } from './data/sykeforloepTestPersoner'

export interface StringFunctionMap {
    [ index: string ]: () => Persona;
}

export const personas: StringFunctionMap = {
    'helt-frisk': () => heltFrisk,
    'en-ny-sykmelding': () => enNySykmelding,
    'en-avvist-sykmelding': () => enAvvistSykmelding,
    'en-ny-oppfolgingsplan': enNyOppfolgingsplan,
    'to-nye-oppfolgingsplaner': toNyeOppfolgingsplaner,
    'en-ny-oppfolgingsplan-til-godkjenning': enNyTilGodkjenning,
    'to-nye-oppfolgingsplaner-til-godkjenning': toTilGodkjenning,
    'langtidssykmeldt': langtidssykmeldt,
    'snart-slutt': snartSlutt,
    'tving-mindre-enn-trettini-uker': tvingMindreEnnTrettiniUker,
}
