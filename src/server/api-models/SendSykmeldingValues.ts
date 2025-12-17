export type SendSykmeldingValues = {
    readonly arbeidsgiverOrgnummer?: string | null
    readonly arbeidsledig?: ArbeidsledigInput | null
    readonly arbeidssituasjon?: ArbeidssituasjonType | null
    readonly egenmeldingsdager?: readonly string[] | null
    readonly egenmeldingsperioder?: readonly DateRange[] | null
    readonly erOpplysningeneRiktige?: YesOrNo | null
    readonly fisker?: FiskerInput | null
    readonly sykFoerSykmeldingen?: YesOrNo | null
    readonly harBruktEgenmelding?: YesOrNo | null
    readonly harEgenmeldingsdager?: YesOrNo | null
    readonly harForsikring?: YesOrNo | null
    readonly riktigNarmesteLeder?: YesOrNo | null
    readonly uriktigeOpplysninger?: readonly UriktigeOpplysningerType[] | null
}
export type ArbeidsledigInput = {
    readonly arbeidsledigFraOrgnummer?: string | null
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

export type FiskerInput = {
    readonly blad?: Blad | null
    readonly lottOgHyre?: LottOgHyre | null
}

export enum LottOgHyre {
    BEGGE = 'BEGGE',
    HYRE = 'HYRE',
    LOTT = 'LOTT',
}

export type DateRange = {
    readonly fom?: string | null
    readonly tom?: string | null
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
