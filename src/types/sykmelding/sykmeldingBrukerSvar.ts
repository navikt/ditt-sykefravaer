import { ArbeidssituasjonType, Blad, FomTom, LottOgHyre } from './sykmeldingCommon'

export type BrukerSvar = {
    readonly arbeidsgiverOrgnummer?: FormSporsmalSvar<string> | null
    readonly arbeidsledig?: ArbeidsledigBrukerSvar | null
    readonly arbeidssituasjon: FormSporsmalSvar<ArbeidssituasjonType>
    readonly egenmeldingsdager?: FormSporsmalSvar<string[]> | null
    readonly egenmeldingsperioder?: FormSporsmalSvar<FomTom[]> | null
    readonly erOpplysningeneRiktige: FormSporsmalSvar<JaEllerNei>
    readonly fisker?: FiskerBrukerSvar | null
    readonly sykFoerSykmeldingen?: FormSporsmalSvar<JaEllerNei> | null
    readonly harBruktEgenmelding?: FormSporsmalSvar<JaEllerNei> | null
    readonly harBruktEgenmeldingsdager?: FormSporsmalSvar<JaEllerNei> | null
    readonly harForsikring?: FormSporsmalSvar<JaEllerNei> | null
    readonly riktigNarmesteLeder?: FormSporsmalSvar<JaEllerNei> | null
    readonly uriktigeOpplysninger?: FormSporsmalSvar<UriktigeOpplysningerType[]> | null
}

export type FormSporsmalSvar<T> = {
    readonly sporsmaltekst: string
    readonly svar: T
}

export type ArbeidsledigBrukerSvar = {
    readonly arbeidsledigFraOrgnummer?: FormSporsmalSvar<string> | null
}

export type FiskerBrukerSvar = {
    readonly blad: FormSporsmalSvar<Blad>
    readonly lottOgHyre: FormSporsmalSvar<LottOgHyre>
}

export enum JaEllerNei {
    JA = 'JA',
    NEI = 'NEI',
}

export enum UriktigeOpplysningerType {
    ANDRE_OPPLYSNINGER = 'ANDRE_OPPLYSNINGER',
    ARBEIDSGIVER = 'ARBEIDSGIVER',
    DIAGNOSE = 'DIAGNOSE',
    PERIODE = 'PERIODE',
    SYKMELDINGSGRAD_FOR_HOY = 'SYKMELDINGSGRAD_FOR_HOY',
    SYKMELDINGSGRAD_FOR_LAV = 'SYKMELDINGSGRAD_FOR_LAV',
}
