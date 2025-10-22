import { jsonDeepCopy } from '../../utils/jsonDeepCopy'
import { Soknad } from '../../types/soknad'
import { RSVedtakWrapper } from '../../types/vedtak'
import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { ArbeidsrettetOppfolging } from '../../types/arbeidsrettetOppfolging'
import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { Melding } from '../../types/melding'
import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { MaxDate } from '../../hooks/useMaxDate'

import { clsPerson } from './data/personas/clsPerson'
import { forskuttererIkkePerson, snartSluttPerson } from './data/personas/sykeforloepTestPersoner'
import { defaultPersona } from './data/personas/personas'
import {
    enNyOppfolgingsplan,
    enNyTilGodkjenning,
    toNyeOppfolgingsplaner,
    toTilGodkjenning,
} from './data/personas/oppfolginsplanTestPersoner'
import {
    manglerInntektsmelding,
    manglerInntektsmeldingVarsel2,
    mottattInntektsmelding,
    henterInntektsmeldingFraAaregMedVerdiFor3Maneder,
    venterPaSaksbehandlingNummer1,
    venterPaSaksbehandlingNummer2,
    henterInntektsmeldingFraAaregMed1ManedInntekt,
    henterInntektsmeldingFraAaregMedIngenManedsInntekt,
} from './data/personas/inntektsmeldingTestPersoner'
import { enAvvistSykmeldingPerson, enNySykmelding, flereNyeSykmeldinger } from './data/personas/sykmeldingPersoner'
import { kunEnSoknadPerson } from './data/personas/kunEnSoknadPerson'
import { heltFriskPerson } from './data/personas/heltFriskPerson'
import {
    syk16sidenMedMaksdato,
    syk17sidenMedMaksdato,
    sykNåMedMaksdato,
    sykNåMedMaksdato59gammel,
    sykNåMedMaksdato60gammel,
} from './data/personas/maksdatoPersoner'
import { nySoknadUtlandEOSPerson } from './data/personas/nySoknadUtlandEOSPerson'
import { flereSoknaderPerson } from './data/personas/flereSoknaderPerson'

export interface Persona {
    soknader: Soknad[]
    vedtak: RSVedtakWrapper[]
    sykmeldinger: DittSykefravaerSykmelding[]
    narmesteledere: NarmesteLeder[]
    maxdato: MaxDate
    arbeidsrettetOppfolging: ArbeidsrettetOppfolging
    oppfolgingsplaner: Oppfolgingsplan[]
    meldinger: Melding[]
    inntektsmeldinger?: InntektsmeldingTyper[]
    beskrivelse: string
}

export type PersonaKey =
    | 'default'
    | 'helt-frisk'
    | 'en-ny-sykmelding'
    | 'flere-nye-sykmeldinger'
    | 'en-avvist-sykmelding'
    | 'en-ny-oppfolgingsplan'
    | 'to-nye-oppfolgingsplaner'
    | 'to-nye-oppfolgingsplaner-til-godkjenning'
    | 'en-ny-oppfolgingsplan-til-godkjenning'
    | 'snart-slutt'
    | 'arbeidsgiver-forskutterer-ikke'
    | 'mangler-inntektsmelding'
    | 'mottatt-inntektsmelding'
    | 'kun-en-soknad'
    | 'flere-soknader'
    | 'cummulative-layout-shift'
    | 'syk-naa-med-maksdato'
    | 'syk-16-siden'
    | 'syk-17-siden'
    | 'syk-naa-med-maksdato-beregnet-59-siden'
    | 'syk-naa-med-maksdato-beregnet-60-siden'
    | 'ny-soknad-utland-eos'
    | 'mangler-inntektsmelding-andre-varsel'
    | 'forelagt-fra-a-ordningen'
    | 'forelagt-fra-a-ordningen-en-maned'
    | 'forelagt-fra-a-ordningen-ingen'
    | 'venter-saksbehandling'
    | 'venter-saksbehandling-revarsel'

export type PersonaData = Partial<Record<PersonaKey, Persona>>

export type PersonaGroupKey = 'blanding' | 'soknader-og-sykmeldinger' | 'oppgaver' | 'testing' | 'maksdato' | 'varsler'
type PersonaGroup = Record<PersonaGroupKey, PersonaData>

export function testpersoner(): PersonaData {
    let alle: PersonaData = {}
    Object.values(testpersonerGruppert()).forEach((group) => {
        alle = { ...alle, ...group }
    })
    return alle
}

export function testpersonerGruppert(): PersonaGroup {
    return {
        ['blanding']: {
            ['helt-frisk']: jsonDeepCopy(heltFriskPerson),
            ['default']: jsonDeepCopy(defaultPersona),
        },
        ['soknader-og-sykmeldinger']: {
            ['kun-en-soknad']: jsonDeepCopy(kunEnSoknadPerson),
            ['flere-soknader']: jsonDeepCopy(flereSoknaderPerson),
            ['en-ny-sykmelding']: jsonDeepCopy(enNySykmelding),
            ['flere-nye-sykmeldinger']: jsonDeepCopy(flereNyeSykmeldinger),
            ['en-avvist-sykmelding']: jsonDeepCopy(enAvvistSykmeldingPerson),
        },
        ['maksdato']: {
            ['syk-naa-med-maksdato']: jsonDeepCopy(sykNåMedMaksdato),
            ['syk-16-siden']: jsonDeepCopy(syk16sidenMedMaksdato),
            ['syk-17-siden']: jsonDeepCopy(syk17sidenMedMaksdato),
            ['syk-naa-med-maksdato-beregnet-59-siden']: jsonDeepCopy(sykNåMedMaksdato59gammel),
            ['syk-naa-med-maksdato-beregnet-60-siden']: jsonDeepCopy(sykNåMedMaksdato60gammel),
        },
        ['varsler']: {
            ['mangler-inntektsmelding']: jsonDeepCopy(manglerInntektsmelding),
            ['mangler-inntektsmelding-andre-varsel']: jsonDeepCopy(manglerInntektsmeldingVarsel2),
            ['forelagt-fra-a-ordningen']: jsonDeepCopy(henterInntektsmeldingFraAaregMedVerdiFor3Maneder),
            ['forelagt-fra-a-ordningen-en-maned']: jsonDeepCopy(henterInntektsmeldingFraAaregMed1ManedInntekt),
            ['forelagt-fra-a-ordningen-ingen']: jsonDeepCopy(henterInntektsmeldingFraAaregMedIngenManedsInntekt),
            ['venter-saksbehandling']: jsonDeepCopy(venterPaSaksbehandlingNummer1),
            ['venter-saksbehandling-revarsel']: jsonDeepCopy(venterPaSaksbehandlingNummer2),
        },
        ['oppgaver']: {
            ['en-ny-oppfolgingsplan']: jsonDeepCopy(enNyOppfolgingsplan),
            ['to-nye-oppfolgingsplaner']: jsonDeepCopy(toNyeOppfolgingsplaner),
            ['en-ny-oppfolgingsplan-til-godkjenning']: jsonDeepCopy(enNyTilGodkjenning),
            ['to-nye-oppfolgingsplaner-til-godkjenning']: jsonDeepCopy(toTilGodkjenning),
            ['snart-slutt']: jsonDeepCopy(snartSluttPerson),
            ['arbeidsgiver-forskutterer-ikke']: jsonDeepCopy(forskuttererIkkePerson),

            ['ny-soknad-utland-eos']: jsonDeepCopy(nySoknadUtlandEOSPerson),
        },
        ['testing']: {
            ['cummulative-layout-shift']: jsonDeepCopy(clsPerson),
            ['mottatt-inntektsmelding']: jsonDeepCopy(mottattInntektsmelding),
        },
    }
}
