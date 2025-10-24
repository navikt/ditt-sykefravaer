/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>

export type Scalars = {
    ID: { input: string; output: string }
    String: { input: string; output: string }
    Boolean: { input: boolean; output: boolean }
    Int: { input: number; output: number }
    Float: { input: number; output: number }
    Date: { input: string; output: string }
    DateTime: { input: string; output: string }
    JSON: { input: unknown; output: unknown }
}

export type ArbeidsledigInput = {
    readonly arbeidsledigFraOrgnummer?: InputMaybe<Scalars['String']['input']>
}

export enum ArbeidssituasjonType {
    ANNET = 'ANNET',
    ARBEIDSLEDIG = 'ARBEIDSLEDIG',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    FISKER = 'FISKER',
    FRILANSER = 'FRILANSER',
    JORDBRUKER = 'JORDBRUKER',
    NAERINGSDRIVENDE = 'NAERINGSDRIVENDE',
    PERMITTERT = 'PERMITTERT',
}

export enum Blad {
    A = 'A',
    B = 'B',
}

export type DateRange = {
    readonly fom?: InputMaybe<Scalars['Date']['input']>
    readonly tom?: InputMaybe<Scalars['Date']['input']>
}

export type FiskerInput = {
    readonly blad?: InputMaybe<Blad>
    readonly lottOgHyre?: InputMaybe<LottOgHyre>
}

export enum LottOgHyre {
    BEGGE = 'BEGGE',
    HYRE = 'HYRE',
    LOTT = 'LOTT',
}

export type SendSykmeldingValues = {
    readonly arbeidsgiverOrgnummer?: InputMaybe<Scalars['String']['input']>
    readonly arbeidsledig?: InputMaybe<ArbeidsledigInput>
    readonly arbeidssituasjon?: InputMaybe<ArbeidssituasjonType>
    readonly egenmeldingsdager?: InputMaybe<ReadonlyArray<Scalars['Date']['input']>>
    readonly egenmeldingsperioder?: InputMaybe<ReadonlyArray<DateRange>>
    readonly erOpplysningeneRiktige?: InputMaybe<YesOrNo>
    readonly fisker?: InputMaybe<FiskerInput>
    readonly harBruktEgenmelding?: InputMaybe<YesOrNo>
    readonly harEgenmeldingsdager?: InputMaybe<YesOrNo>
    readonly harForsikring?: InputMaybe<YesOrNo>
    readonly riktigNarmesteLeder?: InputMaybe<YesOrNo>
    readonly uriktigeOpplysninger?: InputMaybe<ReadonlyArray<UriktigeOpplysningerType>>
}

export enum UriktigeOpplysningerType {
    ANDRE_OPPLYSNINGER = 'ANDRE_OPPLYSNINGER',
    ARBEIDSGIVER = 'ARBEIDSGIVER',
    DIAGNOSE = 'DIAGNOSE',
    PERIODE = 'PERIODE',
    SYKMELDINGSGRAD_FOR_HOY = 'SYKMELDINGSGRAD_FOR_HOY',
    SYKMELDINGSGRAD_FOR_LAV = 'SYKMELDINGSGRAD_FOR_LAV',
}

export enum YesOrNo {
    NO = 'NO',
    YES = 'YES',
}
