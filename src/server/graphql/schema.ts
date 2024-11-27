import { makeExecutableSchema } from '@graphql-tools/schema'

import mockResolvers from './mockResolvers'

export const typeDefs = `
enum RegelStatus {
    OK
    MANUAL_PROCESSING
    INVALID
}

type RegelInfo {
    messageForSender: String!
    messageForUser: String!
    ruleName: String!
    ruleStatus: RegelStatus!
}

type Behandlingsutfall {
    status: RegelStatus!
    ruleHits: [RegelInfo!]!
}
enum JaEllerNei {
    JA
    NEI
}

type ErOpplysningeneRiktigeBrukerSvar {
    sporsmaltekst: String!
    svar: JaEllerNei!
}

type UriktigeOpplysningerBrukerSvar {
    sporsmaltekst: String!
    svar: [UriktigeOpplysningerType!]!
}

type ArbeidssituasjonBrukerSvar {
    sporsmaltekst: String!
    svar: ArbeidssituasjonType!
}

type ArbeidsgiverOrgnummerBrukerSvar {
    sporsmaltekst: String!
    svar: String!
}

type RiktigNarmesteLederBrukerSvar {
    sporsmaltekst: String!
    svar: JaEllerNei!
}

type HarBruktEgenmeldingsdagerBrukerSvar {
    sporsmaltekst: String!
    svar: JaEllerNei!
}

type EgenmeldingsdagerBrukerSvar {
    sporsmaltekst: String!
    svar: [Date!]!
}

type HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar {
    sporsmaltekst: String!
    svar: JaEllerNei!
}

type FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar {
    sporsmaltekst: String!
    svar: [FomTom!]!
}

type HarForsikringBrukerSvar {
    sporsmaltekst: String!
    svar: JaEllerNei!
}

type BladBrukerSvar {
    sporsmaltekst: String!
    svar: Blad!
}

type LottOgHyreBrukerSvar {
    sporsmaltekst: String!
    svar: LottOgHyre!
}

type FiskerBrukerSvar {
    blad: BladBrukerSvar!
    lottOgHyre: LottOgHyreBrukerSvar!
}

type ArbeidsledigFraOrgnummerBrukerSvar {
    sporsmaltekst: String!
    svar: String!
}

type ArbeidsledigBrukerSvar {
    arbeidsledigFraOrgnummer: ArbeidsledigFraOrgnummerBrukerSvar
}

type BrukerSvar {
    erOpplysningeneRiktige: ErOpplysningeneRiktigeBrukerSvar!
    uriktigeOpplysninger: UriktigeOpplysningerBrukerSvar
    arbeidssituasjon: ArbeidssituasjonBrukerSvar!
    arbeidsgiverOrgnummer: ArbeidsgiverOrgnummerBrukerSvar
    riktigNarmesteLeder: RiktigNarmesteLederBrukerSvar
    harBruktEgenmeldingsdager: HarBruktEgenmeldingsdagerBrukerSvar
    egenmeldingsdager: EgenmeldingsdagerBrukerSvar
    harBruktEgenmelding: HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar
    egenmeldingsperioder: FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar
    harForsikring: HarForsikringBrukerSvar
    fisker: FiskerBrukerSvar
    arbeidsledig: ArbeidsledigBrukerSvar
}
type Brukerinformasjon {
    arbeidsgivere: [Arbeidsgiver!]!
}

type Arbeidsgiver {
    orgnummer: String!
    navn: String!
    aktivtArbeidsforhold: Boolean!
    naermesteLeder: NaermesteLeder
}

type NaermesteLeder {
    navn: String!
}

type UtenforVentetid {
    erUtenforVentetid: Boolean!
    oppfolgingsdato: Date
}
scalar Date
scalar DateTime
scalar JSON
enum AnnenFraverGrunn {
    GODKJENT_HELSEINSTITUSJON
    BEHANDLING_FORHINDRER_ARBEID
    ARBEIDSRETTET_TILTAK
    MOTTAR_TILSKUDD_GRUNNET_HELSETILSTAND
    NODVENDIG_KONTROLLUNDENRSOKELSE
    SMITTEFARE
    ABORT
    UFOR_GRUNNET_BARNLOSHET
    DONOR
    BEHANDLING_STERILISERING
}

type Diagnose {
    kode: String!
    system: String!
    tekst: String
}

type AnnenFraversArsak {
    beskrivelse: String
    grunn: [AnnenFraverGrunn!]!
}

type MedisinskVurdering {
    hovedDiagnose: Diagnose
    biDiagnoser: [Diagnose!]!
    annenFraversArsak: AnnenFraversArsak
    svangerskap: Boolean!
    yrkesskade: Boolean!
    yrkesskadeDato: Date
}
enum Periodetype {
    AKTIVITET_IKKE_MULIG
    AVVENTENDE
    BEHANDLINGSDAGER
    GRADERT
    REISETILSKUDD
}

enum MedisinskArsakType {
    TILSTAND_HINDRER_AKTIVITET
    AKTIVITET_FORVERRER_TILSTAND
    AKTIVITET_FORHINDRER_BEDRING
    ANNET
}

enum ArbeidsrelatertArsakType {
    MANGLENDE_TILRETTELEGGING
    ANNET
}

type GradertPeriode {
    grad: Int!
    reisetilskudd: Boolean!
}

type MedisinskArsak {
    beskrivelse: String
    arsak: [MedisinskArsakType!]!
}

type ArbeidsrelatertArsak {
    beskrivelse: String
    arsak: [ArbeidsrelatertArsakType!]!
}

type AktivitetIkkeMuligPeriode {
    medisinskArsak: MedisinskArsak
    arbeidsrelatertArsak: ArbeidsrelatertArsak
}

type Periode {
    fom: Date!
    tom: Date!
    gradert: GradertPeriode
    behandlingsdager: Int
    innspillTilArbeidsgiver: String
    type: Periodetype!
    aktivitetIkkeMulig: AktivitetIkkeMuligPeriode
    reisetilskudd: Boolean!
}
type ErIArbeid {
    egetArbeidPaSikt: Boolean!
    annetArbeidPaSikt: Boolean!
    arbeidFOM: Date
    vurderingsdato: Date
}

type ErIkkeIArbeid {
    arbeidsforPaSikt: Boolean!
    arbeidsforFOM: Date
    vurderingsdato: Date
}

type Prognose {
    arbeidsforEtterPeriode: Boolean!
    hensynArbeidsplassen: String
    erIArbeid: ErIArbeid
    erIkkeIArbeid: ErIkkeIArbeid
}
type Query {
    # Used for old view (SykmeldingerListAll.tsx), if the new view works nicely, this will be deprecated
    sykmeldinger: [Sykmelding!]!
    sykmelding(id: String!): Sykmelding!
    brukerinformasjon(id: String!): Brukerinformasjon!
    sykmeldingUtenforVentetid(id: String!): UtenforVentetid!
    tidligereArbeidsgivere(id: String!): [TidligereArbeidsgiver!]
}

type Mutation {
    changeSykmeldingStatus(sykmeldingId: String!, status: SykmeldingChangeStatus!): Sykmelding!
    sendSykmelding(sykmeldingId: String!, values: SendSykmeldingValues!): Sykmelding!
    updateEgenmeldingsdager(sykmeldingId: String!, egenmeldingsdager: [Date!]!): Sykmelding!

    feedback(feedback: JSON!): Boolean!

    # developer tools, not available in production
    dev_changeScenario(scenario: String!): Boolean!
    dev_setAntallArbeidsgivere(antall: Int!): Boolean!
}

enum SykmeldingChangeStatus {
    AVBRYT
    BEKREFT_AVVIST
}

enum SykmeldingCategory {
    UNSENT
    OLDER
    PROCESSING
}

input SendSykmeldingValues {
    erOpplysningeneRiktige: YesOrNo
    uriktigeOpplysninger: [UriktigeOpplysningerType!]
    arbeidssituasjon: ArbeidssituasjonType
    arbeidsgiverOrgnummer: String
    riktigNarmesteLeder: YesOrNo
    harBruktEgenmelding: YesOrNo
    egenmeldingsperioder: [DateRange!]
    harForsikring: YesOrNo
    egenmeldingsdager: [Date!]
    harEgenmeldingsdager: YesOrNo
    fisker: FiskerInput
    arbeidsledig: ArbeidsledigInput
}

input ArbeidsledigInput {
    arbeidsledigFraOrgnummer: String
}

input FiskerInput {
    blad: Blad
    lottOgHyre: LottOgHyre
}

enum Blad {
    A
    B
}

enum LottOgHyre {
    LOTT
    HYRE
    BEGGE
}

input DateRange {
    fom: Date
    tom: Date
}

enum YesOrNo {
    YES
    NO
}

enum UriktigeOpplysningerType {
    PERIODE
    SYKMELDINGSGRAD_FOR_LAV
    SYKMELDINGSGRAD_FOR_HOY
    ARBEIDSGIVER
    DIAGNOSE
    ANDRE_OPPLYSNINGER
}

enum ArbeidssituasjonType {
    ARBEIDSTAKER
    FRILANSER
    NAERINGSDRIVENDE
    ARBEIDSLEDIG
    FISKER
    JORDBRUKER
    PERMITTERT
    ANNET
}
type Sykmelding {
    id: String!
    mottattTidspunkt: Date!
    behandlingsutfall: Behandlingsutfall!
    arbeidsgiver: ArbeidsgiverSykmelding
    sykmeldingsperioder: [Periode!]!
    sykmeldingStatus: SykmeldingStatus!
    medisinskVurdering: MedisinskVurdering
    prognose: Prognose
    utdypendeOpplysninger: JSON!
    tiltakArbeidsplassen: String
    tiltakNAV: String
    andreTiltak: String
    meldingTilNAV: MeldingTilNAV
    meldingTilArbeidsgiver: String
    kontaktMedPasient: KontaktMedPasient!
    behandletTidspunkt: Date!
    behandler: Behandler!
    egenmeldt: Boolean
    papirsykmelding: Boolean
    merknader: [Merknad!]
    pasient: Pasient
    rulesetVersion: Int!
    utenlandskSykmelding: UtenlandskSykmelding
}

type ArbeidsgiverSykmelding {
    navn: String
}

type MeldingTilNAV {
    bistandUmiddelbart: Boolean!
    beskrivBistand: String
}

type KontaktMedPasient {
    kontaktDato: Date
    begrunnelseIkkeKontakt: String
}

type Adresse {
    gate: String
    postnummer: Int
    kommune: String
    postboks: String
    land: String
}

type Behandler {
    fornavn: String!
    mellomnavn: String
    etternavn: String!
    adresse: Adresse
    tlf: String
}

enum Merknadtype {
    UGYLDIG_TILBAKEDATERING
    TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER
    UNDER_BEHANDLING
    TILBAKEDATERT_PAPIRSYKMELDING
    DELVIS_GODKJENT
}

type Merknad {
    type: Merknadtype!
    beskrivelse: String
}

type Pasient {
    fnr: String
    fornavn: String
    mellomnavn: String
    etternavn: String
    overSyttiAar: Boolean
}

enum SvarRestriksjon {
    SKJERMET_FOR_ARBEIDSGIVER
    SKJERMET_FOR_NAV
}

type UtdypendeOpplysning {
    sporsmal: String
    svar: String!
    restriksjoner: [SvarRestriksjon!]!
}

type UtenlandskSykmelding {
    land: String!
}
enum ShortName {
    ARBEIDSSITUASJON
    NY_NARMESTE_LEDER
    FRAVAER
    PERIODE
    FORSIKRING
    EGENMELDINGSDAGER
}

enum Svartype {
    ARBEIDSSITUASJON
    PERIODER
    JA_NEI
    DAGER
}

enum StatusEvent {
    SENDT
    APEN
    AVBRUTT
    UTGATT
    BEKREFTET
}

type ArbeidsgiverStatus {
    orgnummer: String!
    orgNavn: String!
}

type JaNeiSvar {
    svarType: Svartype!
    svar: YesOrNo!
}

type ArbeidssituasjonSvar {
    svarType: Svartype!
    svar: ArbeidssituasjonType!
}

type DagerSvar {
    svarType: Svartype!
    svar: [Date!]!
}

type PerioderSvar {
    svarType: Svartype!
    svar: [FomTom!]!
}

union SvarTypeUnion = JaNeiSvar | ArbeidssituasjonSvar | DagerSvar | PerioderSvar

type Sporsmal {
    tekst: String!
    shortName: ShortName!
    svar: SvarTypeUnion!
}

type FomTom {
    fom: Date!
    tom: Date!
}

type SykmeldingStatus {
    statusEvent: StatusEvent!
    timestamp: Date!
    arbeidsgiver: ArbeidsgiverStatus
    sporsmalOgSvarListe: [Sporsmal!]!
    brukerSvar: BrukerSvar
}
type TidligereArbeidsgiver {
    orgNavn: String!
    orgnummer: String!
}

`

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: mockResolvers,
})

export default schema
