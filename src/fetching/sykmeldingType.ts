/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** All built-in and custom scalars, mapped to their actual values */
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

export type Sykmelding = {
    readonly id: string
    readonly andreTiltak?: string
    readonly arbeidsgiver?: ArbeidsgiverSykmelding
    readonly behandler: Behandler
    readonly behandletTidspunkt: string
    readonly behandlingsutfall: Behandlingsutfall
    readonly egenmeldt?: boolean
    readonly kontaktMedPasient: KontaktMedPasient
    readonly medisinskVurdering?: MedisinskVurdering
    readonly meldingTilArbeidsgiver?: string
    readonly meldingTilNAV?: MeldingTilNav
    readonly merknader?: ReadonlyArray<Merknad>
    readonly mottattTidspunkt: string
    readonly papirsykmelding?: boolean
    readonly pasient?: Pasient
    readonly prognose?: Prognose
    readonly rulesetVersion: number
    readonly sykmeldingStatus: SykmeldingStatus
    readonly sykmeldingsperioder: ReadonlyArray<Periode>
    readonly tiltakArbeidsplassen?: string
    readonly tiltakNAV?: string
    readonly utdypendeOpplysninger: ReadonlyMap<string, ReadonlyMap<string, UtdypendeOpplysning>>
    readonly utenlandskSykmelding?: UtenlandskSykmelding
}

export type ArbeidsgiverSykmelding = {
    readonly navn?: string
}

export type Behandler = {
    readonly adresse?: Adresse
    readonly etternavn: string
    readonly fornavn: string
    readonly mellomnavn?: string
    readonly tlf?: string
}

export type Adresse = {
    readonly gate?: string
    readonly kommune?: string
    readonly land?: string
    readonly postboks?: string
    readonly postnummer?: number
}

export type Behandlingsutfall = {
    readonly ruleHits: ReadonlyArray<RegelInfo>
    readonly status: RegelStatus
}


export type AktivitetIkkeMuligPeriode = {
    readonly arbeidsrelatertArsak?: ArbeidsrelatertArsak
    readonly medisinskArsak?: MedisinskArsak
}

export enum AnnenFraverGrunn {
    ABORT = 'ABORT',
    ARBEIDSRETTET_TILTAK = 'ARBEIDSRETTET_TILTAK',
    BEHANDLING_FORHINDRER_ARBEID = 'BEHANDLING_FORHINDRER_ARBEID',
    BEHANDLING_STERILISERING = 'BEHANDLING_STERILISERING',
    DONOR = 'DONOR',
    GODKJENT_HELSEINSTITUSJON = 'GODKJENT_HELSEINSTITUSJON',
    MOTTAR_TILSKUDD_GRUNNET_HELSETILSTAND = 'MOTTAR_TILSKUDD_GRUNNET_HELSETILSTAND',
    NODVENDIG_KONTROLLUNDENRSOKELSE = 'NODVENDIG_KONTROLLUNDENRSOKELSE',
    SMITTEFARE = 'SMITTEFARE',
    UFOR_GRUNNET_BARNLOSHET = 'UFOR_GRUNNET_BARNLOSHET',
}

export type AnnenFraversArsak = {
    readonly beskrivelse?: string
    readonly grunn: ReadonlyArray<AnnenFraverGrunn>
}

export type FormSporsmalSvar<T> = {
    readonly sporsmaltekst: string
    readonly svar: T,
}

export type ArbeidsgiverStatus = {
    readonly orgNavn: string
    readonly orgnummer: string
}



export type ArbeidsledigBrukerSvar = {
    readonly arbeidsledigFraOrgnummer?: FormSporsmalSvar<string>
}

export type ArbeidsrelatertArsak = {
    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
    readonly beskrivelse?: string
}

export enum ArbeidsrelatertArsakType {
    ANNET = 'ANNET',
    MANGLENDE_TILRETTELEGGING = 'MANGLENDE_TILRETTELEGGING',
}


export type ArbeidssituasjonSvar = {
    readonly svar: ArbeidssituasjonType
    readonly svarType: Svartype
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

export type DagerSvar = {
    readonly svar: ReadonlyArray<string>
    readonly svarType: Svartype
}

export type Diagnose = {
    readonly kode: string
    readonly system: string
    readonly tekst?: string
}

export type ErIArbeid = {
    readonly annetArbeidPaSikt: boolean
    readonly arbeidFOM?: string
    readonly egetArbeidPaSikt: boolean
    readonly vurderingsdato?: string
}

export type ErIkkeIArbeid = {
    readonly arbeidsforFOM?: string
    readonly arbeidsforPaSikt: boolean
    readonly vurderingsdato?: string
}

export type FiskerBrukerSvar = {
    readonly blad: FormSporsmalSvar<Blad>
    readonly lottOgHyre: FormSporsmalSvar<LottOgHyre>
}

export type FomTom = {
    readonly fom: string
    readonly tom: string
}

export type GradertPeriode = {
    readonly grad: number
    readonly reisetilskudd: boolean
}


export enum JaEllerNei {
    JA = 'JA',
    NEI = 'NEI',
}

export type JaNeiSvar = {
    readonly svar: YesOrNo
    readonly svarType: Svartype
}

export type KontaktMedPasient = {
    readonly begrunnelseIkkeKontakt?: string
    readonly kontaktDato?: string
}

export enum LottOgHyre {
    BEGGE = 'BEGGE',
    HYRE = 'HYRE',
    LOTT = 'LOTT',
}

export type MedisinskArsak = {
    readonly arsak: ReadonlyArray<MedisinskArsakType>
    readonly beskrivelse?: string
}

export enum MedisinskArsakType {
    AKTIVITET_FORHINDRER_BEDRING = 'AKTIVITET_FORHINDRER_BEDRING',
    AKTIVITET_FORVERRER_TILSTAND = 'AKTIVITET_FORVERRER_TILSTAND',
    ANNET = 'ANNET',
    TILSTAND_HINDRER_AKTIVITET = 'TILSTAND_HINDRER_AKTIVITET',
}

export type MedisinskVurdering = {
    readonly annenFraversArsak?: AnnenFraversArsak
    readonly biDiagnoser: ReadonlyArray<Diagnose>
    readonly hovedDiagnose?: Maybe<Diagnose>
    readonly svangerskap: boolean
    readonly yrkesskade: boolean
    readonly yrkesskadeDato?: string
}

export type MeldingTilNav = {
    readonly beskrivBistand?: string
    readonly bistandUmiddelbart: boolean
}

export type Merknad = {
    readonly beskrivelse?: string
    readonly type: Merknadtype
}

export enum Merknadtype {
    DELVIS_GODKJENT = 'DELVIS_GODKJENT',
    TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER = 'TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER',
    UGYLDIG_TILBAKEDATERING = 'UGYLDIG_TILBAKEDATERING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
}

export type Pasient = {
    readonly etternavn?: string
    readonly fnr?: string
    readonly fornavn?: string
    readonly mellomnavn?: string
    readonly overSyttiAar?: boolean
}

export type Periode = {
    readonly type: Periodetype
    readonly fom: string
    readonly tom: string
    readonly aktivitetIkkeMulig?: AktivitetIkkeMuligPeriode
    readonly behandlingsdager?: number
    readonly gradert?: GradertPeriode
    readonly innspillTilArbeidsgiver?: string
    readonly reisetilskudd: boolean
}

export type PerioderSvar = {
    readonly svar: ReadonlyArray<FomTom>
    readonly svarType: Svartype
}

export enum Periodetype {
    AKTIVITET_IKKE_MULIG = 'AKTIVITET_IKKE_MULIG',
    AVVENTENDE = 'AVVENTENDE',
    BEHANDLINGSDAGER = 'BEHANDLINGSDAGER',
    GRADERT = 'GRADERT',
    REISETILSKUDD = 'REISETILSKUDD',
}

export type Prognose = {
    readonly arbeidsforEtterPeriode: boolean
    readonly erIArbeid?: ErIArbeid
    readonly erIkkeIArbeid?: ErIkkeIArbeid
    readonly hensynArbeidsplassen?: string
}

export type RegelInfo = {
    readonly messageForSender: string
    readonly messageForUser: string
    readonly ruleName: string
    readonly ruleStatus: RegelStatus
}

export enum RegelStatus {
    INVALID = 'INVALID',
    MANUAL_PROCESSING = 'MANUAL_PROCESSING',
    OK = 'OK',
}

export enum ShortName {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    EGENMELDINGSDAGER = 'EGENMELDINGSDAGER',
    FORSIKRING = 'FORSIKRING',
    FRAVAER = 'FRAVAER',
    NY_NARMESTE_LEDER = 'NY_NARMESTE_LEDER',
    PERIODE = 'PERIODE',
}

export type Sporsmal = {
    readonly shortName: ShortName
    readonly svar: SvarTypeUnion
    readonly tekst: string
}

export enum StatusEvent {
    APEN = 'APEN',
    AVBRUTT = 'AVBRUTT',
    BEKREFTET = 'BEKREFTET',
    SENDT = 'SENDT',
    UTGATT = 'UTGATT',
}

export enum SvarRestriksjon {}

export type SvarTypeUnion = ArbeidssituasjonSvar | DagerSvar | JaNeiSvar | PerioderSvar

export enum Svartype {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    DAGER = 'DAGER',
    JA_NEI = 'JA_NEI',
    PERIODER = 'PERIODER',
}



export type SykmeldingStatus = {
    readonly arbeidsgiver?: ArbeidsgiverStatus
    readonly brukerSvar?: BrukerSvar
    readonly sporsmalOgSvarListe: ReadonlyArray<Sporsmal>
    readonly statusEvent: StatusEvent
    readonly timestamp: string
}

export enum UriktigeOpplysningerType {
    ANDRE_OPPLYSNINGER = 'ANDRE_OPPLYSNINGER',
    ARBEIDSGIVER = 'ARBEIDSGIVER',
    DIAGNOSE = 'DIAGNOSE',
    PERIODE = 'PERIODE',
    SYKMELDINGSGRAD_FOR_HOY = 'SYKMELDINGSGRAD_FOR_HOY',
    SYKMELDINGSGRAD_FOR_LAV = 'SYKMELDINGSGRAD_FOR_LAV',
}

export type UtdypendeOpplysning = {
    readonly restriksjoner: ReadonlyArray<SvarRestriksjon>
    readonly sporsmal?: string
    readonly svar: string
}

export type UtenlandskSykmelding = {
    readonly land: string
}

export enum YesOrNo {
    NO = 'NO',
    YES = 'YES',
}
