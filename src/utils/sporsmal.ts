import { ArbeidssituasjonType } from '../types/sykmelding/sykmeldingCommon'
import { UriktigeOpplysningerType } from '../types/sykmelding/sykmeldingBrukerSvar'

import { prettifyOrgName } from './orgUtils'
import { toReadableDate } from './dato-utils'

export const sporsmal = {
    erOpplysningeneRiktige: 'Stemmer opplysningene?',
    arbeidssituasjon: 'Jeg er sykmeldt som',
    arbeidsgiverOrgnummer: 'Velg arbeidsgiver',
    riktigNarmesteLeder: (narmesteLederNavn: string) =>
        `Er det ${narmesteLederNavn} som skal følge deg opp på jobben mens du er syk?`,
    sykFoerSykmeldingen: (oppfolgingsdato: string, createDate = () => toReadableDate(oppfolgingsdato)) =>
        `Var du syk og borte fra jobb før du ble sykmeldt ${createDate()}?`,
    harBruktEgenmelding: () => `Ga du beskjed til Nav da du ble syk?`,
    egenmeldingsperioder: () => `Når ga du beskjed?`,
    harForsikring: 'Har du forsikring som gjelder for de første 16 dagene av sykefraværet?',
    uriktigeOpplysninger: 'Hvilke opplysninger stemmer ikke?',
    harBruktEgenmeldingsdager: (arbeidsgiverNavn: string) =>
        `Brukte du egenmelding hos ${prettifyOrgName(arbeidsgiverNavn)}`,
    egenmeldingsdager: 'Velg dagene du brukte egenmelding',
    fisker: {
        velgBlad: 'Velg blad',
        lottEllerHyre: 'Mottar du lott eller er du på hyre?',
    },
    arbeidsledigFra: (sykmeldtAs: ArbeidssituasjonType = ArbeidssituasjonType.ARBEIDSLEDIG) =>
        `Hvilken arbeidsgiver har du blitt ${arbeidsSituasjonEnumToText(sykmeldtAs)} fra?`,
    erSykmeldtFraFlereArbeidsforhold: 'Er du syk fra flere arbeidsforhold i denne perioden?',
}

export function arbeidsSituasjonEnumToText(arbeidssituasjon: ArbeidssituasjonType): string {
    switch (arbeidssituasjon) {
        case ArbeidssituasjonType.ARBEIDSTAKER:
            return 'ansatt'
        case ArbeidssituasjonType.FRILANSER:
            return 'frilanser'
        case ArbeidssituasjonType.NAERINGSDRIVENDE:
            return 'selvstendig næringsdrivende'
        case ArbeidssituasjonType.FISKER:
            return 'fisker'
        case ArbeidssituasjonType.JORDBRUKER:
            return 'jordbruker'
        case ArbeidssituasjonType.ARBEIDSLEDIG:
            return 'arbeidsledig'
        case ArbeidssituasjonType.PERMITTERT:
            return 'permittert'
        case ArbeidssituasjonType.ANNET:
            return 'annet'
    }
}

export function uriktigeOpplysningerEnumToText(uriktigeOpplysninger: UriktigeOpplysningerType): string {
    switch (uriktigeOpplysninger) {
        case UriktigeOpplysningerType.PERIODE:
            return 'Periode'
        case UriktigeOpplysningerType.SYKMELDINGSGRAD_FOR_LAV:
            return 'Sykmeldingsgraden er for lav'
        case UriktigeOpplysningerType.SYKMELDINGSGRAD_FOR_HOY:
            return 'Sykmeldingsgraden er for høy'
        case UriktigeOpplysningerType.ARBEIDSGIVER:
            return 'Arbeidsgiver'
        case UriktigeOpplysningerType.DIAGNOSE:
            return 'Diagnose'
        case UriktigeOpplysningerType.ANDRE_OPPLYSNINGER:
            return 'Andre opplysninger'
    }
}
