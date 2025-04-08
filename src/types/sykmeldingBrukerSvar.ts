import { ArbeidssituasjonType, Blad, FomTom, LottOgHyre } from './sykmeldingCommon'

export type BrukerSvar = {
    readonly arbeidsgiverOrgnummer?: FormSporsmalSvar<string>
    readonly arbeidsledig?: ArbeidsledigBrukerSvar
    readonly arbeidssituasjon: FormSporsmalSvar<ArbeidssituasjonType>
    readonly egenmeldingsdager?: FormSporsmalSvar<ReadonlyArray<string>>
    readonly egenmeldingsperioder?: FormSporsmalSvar<ReadonlyArray<FomTom>>
    readonly erOpplysningeneRiktige: FormSporsmalSvar<JaEllerNei>
    readonly fisker?: FiskerBrukerSvar
    readonly harBruktEgenmelding?: FormSporsmalSvar<JaEllerNei>
    readonly harBruktEgenmeldingsdager?: FormSporsmalSvar<JaEllerNei>
    readonly harForsikring?: FormSporsmalSvar<JaEllerNei>
    readonly riktigNarmesteLeder?: FormSporsmalSvar<JaEllerNei>
    readonly uriktigeOpplysninger?: FormSporsmalSvar<ReadonlyArray<UriktigeOpplysningerType>>
}

export type FormSporsmalSvar<T> = {
    readonly sporsmaltekst: string
    readonly svar: T
}

export type ArbeidsledigBrukerSvar = {
    readonly arbeidsledigFraOrgnummer?: FormSporsmalSvar<string>
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
