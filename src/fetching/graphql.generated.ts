/* eslint-disable */
import { Brukerinformasjon } from '../hooks/useBrukerinformasjonById'

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

export type Adresse = {
    readonly __typename: 'Adresse'
    readonly gate?: Maybe<Scalars['String']['output']>
    readonly kommune?: Maybe<Scalars['String']['output']>
    readonly land?: Maybe<Scalars['String']['output']>
    readonly postboks?: Maybe<Scalars['String']['output']>
    readonly postnummer?: Maybe<Scalars['Int']['output']>
}

export type ArbeidsgiverOrgnummerBrukerSvar = {
    readonly __typename: 'ArbeidsgiverOrgnummerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: Scalars['String']['output']
}

export type ArbeidsledigBrukerSvar = {
    readonly __typename: 'ArbeidsledigBrukerSvar'
    readonly arbeidsledigFraOrgnummer?: Maybe<ArbeidsledigFraOrgnummerBrukerSvar>
}

export type ArbeidsledigFraOrgnummerBrukerSvar = {
    readonly __typename: 'ArbeidsledigFraOrgnummerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: Scalars['String']['output']
}

export type ArbeidsledigInput = {
    readonly arbeidsledigFraOrgnummer?: InputMaybe<Scalars['String']['input']>
}

export type ArbeidssituasjonBrukerSvar = {
    readonly __typename: 'ArbeidssituasjonBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: ArbeidssituasjonType
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

export type Behandler = {
    readonly __typename: 'Behandler'
    readonly adresse?: Maybe<Adresse>
    readonly etternavn: Scalars['String']['output']
    readonly fornavn: Scalars['String']['output']
    readonly mellomnavn?: Maybe<Scalars['String']['output']>
    readonly tlf?: Maybe<Scalars['String']['output']>
}

export enum Blad {
    A = 'A',
    B = 'B',
}

export type BladBrukerSvar = {
    readonly __typename: 'BladBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: Blad
}

export type BrukerSvar = {
    readonly __typename: 'BrukerSvar'
    readonly arbeidsgiverOrgnummer?: Maybe<ArbeidsgiverOrgnummerBrukerSvar>
    readonly arbeidsledig?: Maybe<ArbeidsledigBrukerSvar>
    readonly arbeidssituasjon: ArbeidssituasjonBrukerSvar
    readonly egenmeldingsdager?: Maybe<EgenmeldingsdagerBrukerSvar>
    readonly egenmeldingsperioder?: Maybe<FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar>
    readonly erOpplysningeneRiktige: ErOpplysningeneRiktigeBrukerSvar
    readonly fisker?: Maybe<FiskerBrukerSvar>
    readonly harBruktEgenmelding?: Maybe<HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar>
    readonly harBruktEgenmeldingsdager?: Maybe<HarBruktEgenmeldingsdagerBrukerSvar>
    readonly harForsikring?: Maybe<HarForsikringBrukerSvar>
    readonly riktigNarmesteLeder?: Maybe<RiktigNarmesteLederBrukerSvar>
    readonly uriktigeOpplysninger?: Maybe<UriktigeOpplysningerBrukerSvar>
}

export type DateRange = {
    readonly fom?: InputMaybe<Scalars['Date']['input']>
    readonly tom?: InputMaybe<Scalars['Date']['input']>
}

export type Diagnose = {
    readonly __typename: 'Diagnose'
    readonly kode: Scalars['String']['output']
    readonly system: Scalars['String']['output']
    readonly tekst?: Maybe<Scalars['String']['output']>
}

export type EgenmeldingsdagerBrukerSvar = {
    readonly __typename: 'EgenmeldingsdagerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: ReadonlyArray<Scalars['Date']['output']>
}

export type ErOpplysningeneRiktigeBrukerSvar = {
    readonly __typename: 'ErOpplysningeneRiktigeBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: JaEllerNei
}

export type FiskerBrukerSvar = {
    readonly __typename: 'FiskerBrukerSvar'
    readonly blad: BladBrukerSvar
    readonly lottOgHyre: LottOgHyreBrukerSvar
}

export type FiskerInput = {
    readonly blad?: InputMaybe<Blad>
    readonly lottOgHyre?: InputMaybe<LottOgHyre>
}

export type FomTom = {
    readonly __typename: 'FomTom'
    readonly fom: Scalars['Date']['output']
    readonly tom: Scalars['Date']['output']
}

export type FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar = {
    readonly __typename: 'FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: ReadonlyArray<FomTom>
}
export type HarBruktEgenmeldingsdagerBrukerSvar = {
    readonly __typename: 'HarBruktEgenmeldingsdagerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: JaEllerNei
}

export type HarForsikringBrukerSvar = {
    readonly __typename: 'HarForsikringBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: JaEllerNei
}

export type HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar = {
    readonly __typename: 'HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: JaEllerNei
}

export enum JaEllerNei {
    JA = 'JA',
    NEI = 'NEI',
}

export enum LottOgHyre {
    BEGGE = 'BEGGE',
    HYRE = 'HYRE',
    LOTT = 'LOTT',
}

export type LottOgHyreBrukerSvar = {
    readonly __typename: 'LottOgHyreBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: LottOgHyre
}

export type RiktigNarmesteLederBrukerSvar = {
    readonly __typename: 'RiktigNarmesteLederBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: JaEllerNei
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

export type UriktigeOpplysningerBrukerSvar = {
    readonly __typename: 'UriktigeOpplysningerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: ReadonlyArray<UriktigeOpplysningerType>
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
