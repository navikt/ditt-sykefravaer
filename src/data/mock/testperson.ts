import { jsonDeepCopy } from '../../utils/jsonDeepCopy'

import { manglerInntektsmelding, mottattInntektsmelding } from './data/inntektsmeldingTestPersoner'
import { enNyOppfolgingsplan, enNyTilGodkjenning, toNyeOppfolgingsplaner } from './data/oppfolginsplanTestPersoner'
import { Persona } from './data/persona'
import { commonPersona, defaultPersona, enAvvistSykmelding, enNySykmelding, kunEnSoknad } from './data/personas'
import { forskuttererIkke, snartSlutt } from './data/sykeforloepTestPersoner'

export enum PersonaKeys {
    'default' = 'default',
    'helt-frisk' = 'helt-frisk',
    'en-ny-sykmelding' = 'en-ny-sykmelding',
    'en-avvist-sykmelding' = 'en-avvist-sykmelding',
    'en-ny-oppfolgingsplan' = 'en-ny-oppfolgingsplan',
    'to-nye-oppfolgingsplanerult' = 'to-nye-oppfolgingsplaner',
    'en-ny-oppfolgingsplan-til-godkjenning' = 'en-ny-oppfolgingsplan-til-godkjenning',
    'snart-slutt' = 'snart-slutt',
    'arbeidsgiver-forskutterer-ikke' = 'arbeidsgiver-forskutterer-ikke',
    'mangler-inntektsmelding' = 'mangler-inntektsmelding',
    'mottatt-inntektsmelding' = 'mottatt-inntektsmelding',
    'kun-en-soknad' = 'kun-en-soknad',
}

type PersonaData = Record<PersonaKeys, Persona>

export function testpersoner(): PersonaData {
    const data: PersonaData = {
        [PersonaKeys['default']]: jsonDeepCopy(defaultPersona),
        [PersonaKeys['helt-frisk']]: jsonDeepCopy(commonPersona()),
        [PersonaKeys['en-ny-sykmelding']]: jsonDeepCopy(enNySykmelding),
        [PersonaKeys['en-avvist-sykmelding']]: jsonDeepCopy(enAvvistSykmelding),
        [PersonaKeys['en-ny-oppfolgingsplan']]: jsonDeepCopy(enNyOppfolgingsplan()),
        [PersonaKeys['to-nye-oppfolgingsplanerult']]: jsonDeepCopy(toNyeOppfolgingsplaner()),
        [PersonaKeys['en-ny-oppfolgingsplan-til-godkjenning']]: jsonDeepCopy(enNyTilGodkjenning()),
        [PersonaKeys['snart-slutt']]: jsonDeepCopy(snartSlutt()),
        [PersonaKeys['arbeidsgiver-forskutterer-ikke']]: jsonDeepCopy(forskuttererIkke()),
        [PersonaKeys['mangler-inntektsmelding']]: jsonDeepCopy(manglerInntektsmelding()),
        [PersonaKeys['mottatt-inntektsmelding']]: jsonDeepCopy(mottattInntektsmelding()),
        [PersonaKeys['kun-en-soknad']]: jsonDeepCopy(kunEnSoknad()),
    }

    return data
}
