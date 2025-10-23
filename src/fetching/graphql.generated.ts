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

export type Adresse = {
    readonly __typename: 'Adresse'
    readonly gate?: Maybe<Scalars['String']['output']>
    readonly kommune?: Maybe<Scalars['String']['output']>
    readonly land?: Maybe<Scalars['String']['output']>
    readonly postboks?: Maybe<Scalars['String']['output']>
    readonly postnummer?: Maybe<Scalars['Int']['output']>
}

export type AktivitetIkkeMuligPeriode = {
    readonly __typename: 'AktivitetIkkeMuligPeriode'
    readonly arbeidsrelatertArsak?: Maybe<ArbeidsrelatertArsak>
    readonly medisinskArsak?: Maybe<MedisinskArsak>
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
    readonly __typename: 'AnnenFraversArsak'
    readonly beskrivelse?: Maybe<Scalars['String']['output']>
    readonly grunn: ReadonlyArray<AnnenFraverGrunn>
}

export type Arbeidsgiver = {
    readonly __typename: 'Arbeidsgiver'
    readonly aktivtArbeidsforhold: Scalars['Boolean']['output']
    readonly naermesteLeder?: Maybe<NaermesteLeder>
    navn: Scalars['String']['output']
    readonly orgnummer: Scalars['String']['output']
}

export type ArbeidsgiverOrgnummerBrukerSvar = {
    readonly __typename: 'ArbeidsgiverOrgnummerBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: Scalars['String']['output']
}

export type ArbeidsgiverStatus = {
    readonly __typename: 'ArbeidsgiverStatus'
    readonly orgNavn: Scalars['String']['output']
    readonly orgnummer: Scalars['String']['output']
}

export type ArbeidsgiverSykmelding = {
    readonly __typename: 'ArbeidsgiverSykmelding'
    readonly navn?: Maybe<Scalars['String']['output']>
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

export type ArbeidsrelatertArsak = {
    readonly __typename: 'ArbeidsrelatertArsak'
    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
    readonly beskrivelse?: Maybe<Scalars['String']['output']>
}

export enum ArbeidsrelatertArsakType {
    ANNET = 'ANNET',
    MANGLENDE_TILRETTELEGGING = 'MANGLENDE_TILRETTELEGGING',
}

export type ArbeidssituasjonBrukerSvar = {
    readonly __typename: 'ArbeidssituasjonBrukerSvar'
    readonly sporsmaltekst: Scalars['String']['output']
    readonly svar: ArbeidssituasjonType
}

export type ArbeidssituasjonSvar = {
    readonly __typename: 'ArbeidssituasjonSvar'
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

export type Behandler = {
    readonly __typename: 'Behandler'
    readonly adresse?: Maybe<Adresse>
    readonly etternavn: Scalars['String']['output']
    readonly fornavn: Scalars['String']['output']
    readonly mellomnavn?: Maybe<Scalars['String']['output']>
    readonly tlf?: Maybe<Scalars['String']['output']>
}

export type Behandlingsutfall = {
    readonly __typename: 'Behandlingsutfall'
    readonly ruleHits: ReadonlyArray<RegelInfo>
    readonly status: RegelStatus
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

export type Brukerinformasjon = {
    readonly __typename: 'Brukerinformasjon'
    readonly arbeidsgivere: ReadonlyArray<Arbeidsgiver>
}

export type DagerSvar = {
    readonly __typename: 'DagerSvar'
    readonly svar: ReadonlyArray<Scalars['Date']['output']>
    readonly svarType: Svartype
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

export type ErIArbeid = {
    readonly __typename: 'ErIArbeid'
    readonly annetArbeidPaSikt: Scalars['Boolean']['output']
    readonly arbeidFOM?: Maybe<Scalars['Date']['output']>
    readonly egetArbeidPaSikt: Scalars['Boolean']['output']
    readonly vurderingsdato?: Maybe<Scalars['Date']['output']>
}

export type ErIkkeIArbeid = {
    readonly __typename: 'ErIkkeIArbeid'
    readonly arbeidsforFOM?: Maybe<Scalars['Date']['output']>
    readonly arbeidsforPaSikt: Scalars['Boolean']['output']
    readonly vurderingsdato?: Maybe<Scalars['Date']['output']>
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

export type GradertPeriode = {
    readonly __typename: 'GradertPeriode'
    readonly grad: Scalars['Int']['output']
    readonly reisetilskudd: Scalars['Boolean']['output']
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

export type JaNeiSvar = {
    readonly __typename: 'JaNeiSvar'
    readonly svar: YesOrNo
    readonly svarType: Svartype
}

export type KontaktMedPasient = {
    readonly __typename: 'KontaktMedPasient'
    readonly begrunnelseIkkeKontakt?: Maybe<Scalars['String']['output']>
    readonly kontaktDato?: Maybe<Scalars['Date']['output']>
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

export type MedisinskArsak = {
    readonly __typename: 'MedisinskArsak'
    readonly arsak: ReadonlyArray<MedisinskArsakType>
    readonly beskrivelse?: Maybe<Scalars['String']['output']>
}

export enum MedisinskArsakType {
    AKTIVITET_FORHINDRER_BEDRING = 'AKTIVITET_FORHINDRER_BEDRING',
    AKTIVITET_FORVERRER_TILSTAND = 'AKTIVITET_FORVERRER_TILSTAND',
    ANNET = 'ANNET',
    TILSTAND_HINDRER_AKTIVITET = 'TILSTAND_HINDRER_AKTIVITET',
}

export type MedisinskVurdering = {
    readonly __typename: 'MedisinskVurdering'
    readonly annenFraversArsak?: Maybe<AnnenFraversArsak>
    readonly biDiagnoser: ReadonlyArray<Diagnose>
    readonly hovedDiagnose?: Maybe<Diagnose>
    readonly svangerskap: Scalars['Boolean']['output']
    readonly yrkesskade: Scalars['Boolean']['output']
    readonly yrkesskadeDato?: Maybe<Scalars['Date']['output']>
}

export type MeldingTilNav = {
    readonly __typename: 'MeldingTilNAV'
    readonly beskrivBistand?: Maybe<Scalars['String']['output']>
    readonly bistandUmiddelbart: Scalars['Boolean']['output']
}

export type Merknad = {
    readonly __typename: 'Merknad'
    readonly beskrivelse?: Maybe<Scalars['String']['output']>
    readonly type: Merknadtype
}

export enum Merknadtype {
    DELVIS_GODKJENT = 'DELVIS_GODKJENT',
    TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER = 'TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER',
    UGYLDIG_TILBAKEDATERING = 'UGYLDIG_TILBAKEDATERING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
}

export type Mutation = {
    readonly __typename: 'Mutation'
    readonly changeSykmeldingStatus: Sykmelding
    readonly dev_changeScenario: Scalars['Boolean']['output']
    readonly dev_setAntallArbeidsgivere: Scalars['Boolean']['output']
    readonly feedback: Scalars['Boolean']['output']
    readonly sendSykmelding: Sykmelding
    readonly updateEgenmeldingsdager: Sykmelding
}

export type NaermesteLeder = {
    readonly __typename: 'NaermesteLeder'
    readonly navn: Scalars['String']['output']
}

export type Pasient = {
    readonly __typename: 'Pasient'
    readonly etternavn?: Maybe<Scalars['String']['output']>
    readonly fnr?: Maybe<Scalars['String']['output']>
    readonly fornavn?: Maybe<Scalars['String']['output']>
    readonly mellomnavn?: Maybe<Scalars['String']['output']>
    readonly overSyttiAar?: Maybe<Scalars['Boolean']['output']>
}

export type Periode = {
    readonly __typename: 'Periode'
    readonly aktivitetIkkeMulig?: Maybe<AktivitetIkkeMuligPeriode>
    readonly behandlingsdager?: Maybe<Scalars['Int']['output']>
    readonly fom: Scalars['Date']['output']
    readonly gradert?: Maybe<GradertPeriode>
    readonly innspillTilArbeidsgiver?: Maybe<Scalars['String']['output']>
    readonly reisetilskudd: Scalars['Boolean']['output']
    readonly tom: Scalars['Date']['output']
    readonly type: Periodetype
}

export type PerioderSvar = {
    readonly __typename: 'PerioderSvar'
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
    readonly __typename: 'Prognose'
    readonly arbeidsforEtterPeriode: Scalars['Boolean']['output']
    readonly erIArbeid?: Maybe<ErIArbeid>
    readonly erIkkeIArbeid?: Maybe<ErIkkeIArbeid>
    readonly hensynArbeidsplassen?: Maybe<Scalars['String']['output']>
}

export type Query = {
    readonly __typename: 'Query'
    readonly brukerinformasjon: Brukerinformasjon
    readonly sykmelding: Sykmelding
    readonly sykmeldingUtenforVentetid: UtenforVentetid
    readonly sykmeldinger: ReadonlyArray<Sykmelding>
    readonly tidligereArbeidsgivere?: Maybe<ReadonlyArray<TidligereArbeidsgiver>>
}

export type RegelInfo = {
    readonly __typename: 'RegelInfo'
    readonly messageForSender: Scalars['String']['output']
    readonly messageForUser: Scalars['String']['output']
    readonly ruleName: Scalars['String']['output']
    readonly ruleStatus: RegelStatus
}

export enum RegelStatus {
    INVALID = 'INVALID',
    MANUAL_PROCESSING = 'MANUAL_PROCESSING',
    OK = 'OK',
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

export enum ShortName {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    EGENMELDINGSDAGER = 'EGENMELDINGSDAGER',
    FORSIKRING = 'FORSIKRING',
    FRAVAER = 'FRAVAER',
    NY_NARMESTE_LEDER = 'NY_NARMESTE_LEDER',
    PERIODE = 'PERIODE',
}

export type Sporsmal = {
    readonly __typename: 'Sporsmal'
    readonly shortName: ShortName
    readonly svar: SvarTypeUnion
    readonly tekst: Scalars['String']['output']
}

export enum StatusEvent {
    APEN = 'APEN',
    AVBRUTT = 'AVBRUTT',
    BEKREFTET = 'BEKREFTET',
    SENDT = 'SENDT',
    UTGATT = 'UTGATT',
}

export type SvarTypeUnion = ArbeidssituasjonSvar | DagerSvar | JaNeiSvar | PerioderSvar

export enum Svartype {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    DAGER = 'DAGER',
    JA_NEI = 'JA_NEI',
    PERIODER = 'PERIODER',
}

export type Sykmelding = {
    readonly __typename: 'Sykmelding'
    readonly andreTiltak?: Maybe<Scalars['String']['output']>
    readonly arbeidsgiver?: Maybe<ArbeidsgiverSykmelding>
    readonly behandler: Behandler
    readonly behandletTidspunkt: Scalars['Date']['output']
    readonly behandlingsutfall: Behandlingsutfall
    readonly egenmeldt?: Maybe<Scalars['Boolean']['output']>
    readonly id: Scalars['String']['output']
    readonly kontaktMedPasient: KontaktMedPasient
    readonly medisinskVurdering?: Maybe<MedisinskVurdering>
    readonly meldingTilArbeidsgiver?: Maybe<Scalars['String']['output']>
    readonly meldingTilNAV?: Maybe<MeldingTilNav>
    readonly merknader?: Maybe<ReadonlyArray<Merknad>>
    readonly mottattTidspunkt: Scalars['Date']['output']
    readonly papirsykmelding?: Maybe<Scalars['Boolean']['output']>
    readonly pasient?: Maybe<Pasient>
    readonly prognose?: Maybe<Prognose>
    readonly rulesetVersion: Scalars['Int']['output']
    readonly sykmeldingStatus: SykmeldingStatus
    readonly sykmeldingsperioder: ReadonlyArray<Periode>
    readonly tiltakArbeidsplassen?: Maybe<Scalars['String']['output']>
    readonly tiltakNAV?: Maybe<Scalars['String']['output']>
    readonly utdypendeOpplysninger: Scalars['JSON']['output']
    readonly utenlandskSykmelding?: Maybe<UtenlandskSykmelding>
}

export enum SykmeldingChangeStatus {
    AVBRYT = 'AVBRYT',
    BEKREFT_AVVIST = 'BEKREFT_AVVIST',
}

export type SykmeldingStatus = {
    readonly __typename: 'SykmeldingStatus'
    readonly arbeidsgiver?: Maybe<ArbeidsgiverStatus>
    readonly brukerSvar?: Maybe<BrukerSvar>
    readonly sporsmalOgSvarListe: ReadonlyArray<Sporsmal>
    readonly statusEvent: StatusEvent
    readonly timestamp: Scalars['Date']['output']
}

export type TidligereArbeidsgiver = {
    readonly __typename: 'TidligereArbeidsgiver'
    readonly orgNavn: Scalars['String']['output']
    readonly orgnummer: Scalars['String']['output']
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

export type UtenforVentetid = {
    readonly __typename: 'UtenforVentetid'
    readonly erUtenforVentetid: Scalars['Boolean']['output']
    readonly oppfolgingsdato?: Maybe<Scalars['Date']['output']>
}

export type UtenlandskSykmelding = {
    readonly __typename: 'UtenlandskSykmelding'
    readonly land: Scalars['String']['output']
}

export enum YesOrNo {
    NO = 'NO',
    YES = 'YES',
}

export type NaermesteLederFragment = { readonly __typename: 'NaermesteLeder'; readonly navn: string }

export type BrukerinformasjonFragment = {
    readonly __typename: 'Brukerinformasjon'
    readonly arbeidsgivere: ReadonlyArray<{
        readonly __typename: 'Arbeidsgiver'
        readonly orgnummer: string
        readonly navn: string
        readonly aktivtArbeidsforhold: boolean
        readonly naermesteLeder?: { readonly __typename: 'NaermesteLeder'; readonly navn: string } | null
    }>
}

export type ChangeSykmeldingStatusMutation = {
    readonly __typename: 'Mutation'
    readonly changeSykmeldingStatus: {
        readonly __typename: 'Sykmelding'
        readonly id: string
        readonly mottattTidspunkt: string
        readonly utdypendeOpplysninger: unknown
        readonly tiltakArbeidsplassen?: string | null
        readonly tiltakNAV?: string | null
        readonly andreTiltak?: string | null
        readonly meldingTilArbeidsgiver?: string | null
        readonly behandletTidspunkt: string
        readonly egenmeldt?: boolean | null
        readonly papirsykmelding?: boolean | null
        readonly rulesetVersion: number
        readonly behandlingsutfall: {
            readonly __typename: 'Behandlingsutfall'
            readonly status: RegelStatus
            readonly ruleHits: ReadonlyArray<{
                readonly __typename: 'RegelInfo'
                readonly messageForSender: string
                readonly messageForUser: string
                readonly ruleName: string
                readonly ruleStatus: RegelStatus
            }>
        }
        readonly arbeidsgiver?: { readonly __typename: 'ArbeidsgiverSykmelding'; readonly navn?: string | null } | null
        readonly sykmeldingsperioder: ReadonlyArray<{
            readonly __typename: 'Periode'
            readonly fom: string
            readonly tom: string
            readonly behandlingsdager?: number | null
            readonly innspillTilArbeidsgiver?: string | null
            readonly type: Periodetype
            readonly reisetilskudd: boolean
            readonly gradert?: {
                readonly __typename: 'GradertPeriode'
                readonly grad: number
                readonly reisetilskudd: boolean
            } | null
            readonly aktivitetIkkeMulig?: {
                readonly __typename: 'AktivitetIkkeMuligPeriode'
                readonly medisinskArsak?: {
                    readonly __typename: 'MedisinskArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<MedisinskArsakType>
                } | null
                readonly arbeidsrelatertArsak?: {
                    readonly __typename: 'ArbeidsrelatertArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
                } | null
            } | null
        }>
        readonly sykmeldingStatus: {
            readonly __typename: 'SykmeldingStatus'
            readonly statusEvent: StatusEvent
            readonly timestamp: string
            readonly arbeidsgiver?: {
                readonly __typename: 'ArbeidsgiverStatus'
                readonly orgnummer: string
                readonly orgNavn: string
            } | null
            readonly sporsmalOgSvarListe: ReadonlyArray<{
                readonly __typename: 'Sporsmal'
                readonly tekst: string
                readonly shortName: ShortName
                readonly svar:
                    | {
                          readonly __typename: 'ArbeidssituasjonSvar'
                          readonly svarType: Svartype
                          readonly arbeidsituasjon: ArbeidssituasjonType
                      }
                    | {
                          readonly __typename: 'DagerSvar'
                          readonly svarType: Svartype
                          readonly dager: ReadonlyArray<string>
                      }
                    | { readonly __typename: 'JaNeiSvar'; readonly svarType: Svartype; readonly jaNei: YesOrNo }
                    | {
                          readonly __typename: 'PerioderSvar'
                          readonly svarType: Svartype
                          readonly perioder: ReadonlyArray<{
                              readonly __typename: 'FomTom'
                              readonly fom: string
                              readonly tom: string
                          }>
                      }
            }>
            readonly brukerSvar?: {
                readonly __typename: 'BrukerSvar'
                readonly erOpplysningeneRiktige: {
                    readonly __typename: 'ErOpplysningeneRiktigeBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                }
                readonly uriktigeOpplysninger?: {
                    readonly __typename: 'UriktigeOpplysningerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<UriktigeOpplysningerType>
                } | null
                readonly arbeidssituasjon: {
                    readonly __typename: 'ArbeidssituasjonBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ArbeidssituasjonType
                }
                readonly arbeidsgiverOrgnummer?: {
                    readonly __typename: 'ArbeidsgiverOrgnummerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: string
                } | null
                readonly riktigNarmesteLeder?: {
                    readonly __typename: 'RiktigNarmesteLederBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly harBruktEgenmeldingsdager?: {
                    readonly __typename: 'HarBruktEgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsdager?: {
                    readonly __typename: 'EgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<string>
                } | null
                readonly harBruktEgenmelding?: {
                    readonly __typename: 'HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsperioder?: {
                    readonly __typename: 'FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<{
                        readonly __typename: 'FomTom'
                        readonly fom: string
                        readonly tom: string
                    }>
                } | null
                readonly harForsikring?: {
                    readonly __typename: 'HarForsikringBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly fisker?: {
                    readonly __typename: 'FiskerBrukerSvar'
                    readonly blad: {
                        readonly __typename: 'BladBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: Blad
                    }
                    readonly lottOgHyre: {
                        readonly __typename: 'LottOgHyreBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: LottOgHyre
                    }
                } | null
                readonly arbeidsledig?: {
                    readonly __typename: 'ArbeidsledigBrukerSvar'
                    readonly arbeidsledigFraOrgnummer?: {
                        readonly __typename: 'ArbeidsledigFraOrgnummerBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: string
                    } | null
                } | null
            } | null
        }
        readonly medisinskVurdering?: {
            readonly __typename: 'MedisinskVurdering'
            readonly svangerskap: boolean
            readonly yrkesskade: boolean
            readonly yrkesskadeDato?: string | null
            readonly hovedDiagnose?: {
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            } | null
            readonly biDiagnoser: ReadonlyArray<{
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            }>
            readonly annenFraversArsak?: {
                readonly __typename: 'AnnenFraversArsak'
                readonly grunn: ReadonlyArray<AnnenFraverGrunn>
                readonly beskrivelse?: string | null
            } | null
        } | null
        readonly prognose?: {
            readonly __typename: 'Prognose'
            readonly arbeidsforEtterPeriode: boolean
            readonly hensynArbeidsplassen?: string | null
            readonly erIArbeid?: {
                readonly __typename: 'ErIArbeid'
                readonly egetArbeidPaSikt: boolean
                readonly annetArbeidPaSikt: boolean
                readonly arbeidFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
            readonly erIkkeIArbeid?: {
                readonly __typename: 'ErIkkeIArbeid'
                readonly arbeidsforPaSikt: boolean
                readonly arbeidsforFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
        } | null
        readonly meldingTilNAV?: {
            readonly __typename: 'MeldingTilNAV'
            readonly beskrivBistand?: string | null
            readonly bistandUmiddelbart: boolean
        } | null
        readonly kontaktMedPasient: {
            readonly __typename: 'KontaktMedPasient'
            readonly begrunnelseIkkeKontakt?: string | null
            readonly kontaktDato?: string | null
        }
        readonly behandler: {
            readonly __typename: 'Behandler'
            readonly fornavn: string
            readonly mellomnavn?: string | null
            readonly etternavn: string
            readonly tlf?: string | null
            readonly adresse?: {
                readonly __typename: 'Adresse'
                readonly gate?: string | null
                readonly postnummer?: number | null
                readonly kommune?: string | null
                readonly postboks?: string | null
                readonly land?: string | null
            } | null
        }
        readonly merknader?: ReadonlyArray<{
            readonly __typename: 'Merknad'
            readonly beskrivelse?: string | null
            readonly type: Merknadtype
        }> | null
        readonly pasient?: {
            readonly __typename: 'Pasient'
            readonly fnr?: string | null
            readonly fornavn?: string | null
            readonly mellomnavn?: string | null
            readonly etternavn?: string | null
            readonly overSyttiAar?: boolean | null
        } | null
        readonly utenlandskSykmelding?: { readonly __typename: 'UtenlandskSykmelding'; readonly land: string } | null
    }
}

export type SendSykmeldingMutation = {
    readonly __typename: 'Mutation'
    readonly sendSykmelding: {
        readonly __typename: 'Sykmelding'
        readonly id: string
        readonly mottattTidspunkt: string
        readonly utdypendeOpplysninger: unknown
        readonly tiltakArbeidsplassen?: string | null
        readonly tiltakNAV?: string | null
        readonly andreTiltak?: string | null
        readonly meldingTilArbeidsgiver?: string | null
        readonly behandletTidspunkt: string
        readonly egenmeldt?: boolean | null
        readonly papirsykmelding?: boolean | null
        readonly rulesetVersion: number
        readonly behandlingsutfall: {
            readonly __typename: 'Behandlingsutfall'
            readonly status: RegelStatus
            readonly ruleHits: ReadonlyArray<{
                readonly __typename: 'RegelInfo'
                readonly messageForSender: string
                readonly messageForUser: string
                readonly ruleName: string
                readonly ruleStatus: RegelStatus
            }>
        }
        readonly arbeidsgiver?: { readonly __typename: 'ArbeidsgiverSykmelding'; readonly navn?: string | null } | null
        readonly sykmeldingsperioder: ReadonlyArray<{
            readonly __typename: 'Periode'
            readonly fom: string
            readonly tom: string
            readonly behandlingsdager?: number | null
            readonly innspillTilArbeidsgiver?: string | null
            readonly type: Periodetype
            readonly reisetilskudd: boolean
            readonly gradert?: {
                readonly __typename: 'GradertPeriode'
                readonly grad: number
                readonly reisetilskudd: boolean
            } | null
            readonly aktivitetIkkeMulig?: {
                readonly __typename: 'AktivitetIkkeMuligPeriode'
                readonly medisinskArsak?: {
                    readonly __typename: 'MedisinskArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<MedisinskArsakType>
                } | null
                readonly arbeidsrelatertArsak?: {
                    readonly __typename: 'ArbeidsrelatertArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
                } | null
            } | null
        }>
        readonly sykmeldingStatus: {
            readonly __typename: 'SykmeldingStatus'
            readonly statusEvent: StatusEvent
            readonly timestamp: string
            readonly arbeidsgiver?: {
                readonly __typename: 'ArbeidsgiverStatus'
                readonly orgnummer: string
                readonly orgNavn: string
            } | null
            readonly sporsmalOgSvarListe: ReadonlyArray<{
                readonly __typename: 'Sporsmal'
                readonly tekst: string
                readonly shortName: ShortName
                readonly svar:
                    | {
                          readonly __typename: 'ArbeidssituasjonSvar'
                          readonly svarType: Svartype
                          readonly arbeidsituasjon: ArbeidssituasjonType
                      }
                    | {
                          readonly __typename: 'DagerSvar'
                          readonly svarType: Svartype
                          readonly dager: ReadonlyArray<string>
                      }
                    | { readonly __typename: 'JaNeiSvar'; readonly svarType: Svartype; readonly jaNei: YesOrNo }
                    | {
                          readonly __typename: 'PerioderSvar'
                          readonly svarType: Svartype
                          readonly perioder: ReadonlyArray<{
                              readonly __typename: 'FomTom'
                              readonly fom: string
                              readonly tom: string
                          }>
                      }
            }>
            readonly brukerSvar?: {
                readonly __typename: 'BrukerSvar'
                readonly erOpplysningeneRiktige: {
                    readonly __typename: 'ErOpplysningeneRiktigeBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                }
                readonly uriktigeOpplysninger?: {
                    readonly __typename: 'UriktigeOpplysningerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<UriktigeOpplysningerType>
                } | null
                readonly arbeidssituasjon: {
                    readonly __typename: 'ArbeidssituasjonBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ArbeidssituasjonType
                }
                readonly arbeidsgiverOrgnummer?: {
                    readonly __typename: 'ArbeidsgiverOrgnummerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: string
                } | null
                readonly riktigNarmesteLeder?: {
                    readonly __typename: 'RiktigNarmesteLederBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly harBruktEgenmeldingsdager?: {
                    readonly __typename: 'HarBruktEgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsdager?: {
                    readonly __typename: 'EgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<string>
                } | null
                readonly harBruktEgenmelding?: {
                    readonly __typename: 'HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsperioder?: {
                    readonly __typename: 'FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<{
                        readonly __typename: 'FomTom'
                        readonly fom: string
                        readonly tom: string
                    }>
                } | null
                readonly harForsikring?: {
                    readonly __typename: 'HarForsikringBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly fisker?: {
                    readonly __typename: 'FiskerBrukerSvar'
                    readonly blad: {
                        readonly __typename: 'BladBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: Blad
                    }
                    readonly lottOgHyre: {
                        readonly __typename: 'LottOgHyreBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: LottOgHyre
                    }
                } | null
                readonly arbeidsledig?: {
                    readonly __typename: 'ArbeidsledigBrukerSvar'
                    readonly arbeidsledigFraOrgnummer?: {
                        readonly __typename: 'ArbeidsledigFraOrgnummerBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: string
                    } | null
                } | null
            } | null
        }
        readonly medisinskVurdering?: {
            readonly __typename: 'MedisinskVurdering'
            readonly svangerskap: boolean
            readonly yrkesskade: boolean
            readonly yrkesskadeDato?: string | null
            readonly hovedDiagnose?: {
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            } | null
            readonly biDiagnoser: ReadonlyArray<{
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            }>
            readonly annenFraversArsak?: {
                readonly __typename: 'AnnenFraversArsak'
                readonly grunn: ReadonlyArray<AnnenFraverGrunn>
                readonly beskrivelse?: string | null
            } | null
        } | null
        readonly prognose?: {
            readonly __typename: 'Prognose'
            readonly arbeidsforEtterPeriode: boolean
            readonly hensynArbeidsplassen?: string | null
            readonly erIArbeid?: {
                readonly __typename: 'ErIArbeid'
                readonly egetArbeidPaSikt: boolean
                readonly annetArbeidPaSikt: boolean
                readonly arbeidFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
            readonly erIkkeIArbeid?: {
                readonly __typename: 'ErIkkeIArbeid'
                readonly arbeidsforPaSikt: boolean
                readonly arbeidsforFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
        } | null
        readonly meldingTilNAV?: {
            readonly __typename: 'MeldingTilNAV'
            readonly beskrivBistand?: string | null
            readonly bistandUmiddelbart: boolean
        } | null
        readonly kontaktMedPasient: {
            readonly __typename: 'KontaktMedPasient'
            readonly begrunnelseIkkeKontakt?: string | null
            readonly kontaktDato?: string | null
        }
        readonly behandler: {
            readonly __typename: 'Behandler'
            readonly fornavn: string
            readonly mellomnavn?: string | null
            readonly etternavn: string
            readonly tlf?: string | null
            readonly adresse?: {
                readonly __typename: 'Adresse'
                readonly gate?: string | null
                readonly postnummer?: number | null
                readonly kommune?: string | null
                readonly postboks?: string | null
                readonly land?: string | null
            } | null
        }
        readonly merknader?: ReadonlyArray<{
            readonly __typename: 'Merknad'
            readonly beskrivelse?: string | null
            readonly type: Merknadtype
        }> | null
        readonly pasient?: {
            readonly __typename: 'Pasient'
            readonly fnr?: string | null
            readonly fornavn?: string | null
            readonly mellomnavn?: string | null
            readonly etternavn?: string | null
            readonly overSyttiAar?: boolean | null
        } | null
        readonly utenlandskSykmelding?: { readonly __typename: 'UtenlandskSykmelding'; readonly land: string } | null
    }
}
