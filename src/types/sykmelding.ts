import { BrukerSvar } from './sykmeldingBrukerSvar'
import { Sporsmal } from './sykmeldingSporsmalSvarListe'

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

export type ArbeidsgiverStatus = {
    readonly orgNavn: string
    readonly orgnummer: string
}

export type ArbeidsrelatertArsak = {
    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
    readonly beskrivelse?: string
}

export enum ArbeidsrelatertArsakType {
    ANNET = 'ANNET',
    MANGLENDE_TILRETTELEGGING = 'MANGLENDE_TILRETTELEGGING',
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

export type GradertPeriode = {
    readonly grad: number
    readonly reisetilskudd: boolean
}

export type KontaktMedPasient = {
    readonly begrunnelseIkkeKontakt?: string
    readonly kontaktDato?: string
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
    readonly hovedDiagnose?: Diagnose
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

export enum StatusEvent {
    APEN = 'APEN',
    AVBRUTT = 'AVBRUTT',
    BEKREFTET = 'BEKREFTET',
    SENDT = 'SENDT',
    UTGATT = 'UTGATT',
}

export type SykmeldingStatus = {
    readonly arbeidsgiver?: ArbeidsgiverStatus
    readonly brukerSvar?: BrukerSvar
    readonly sporsmalOgSvarListe: ReadonlyArray<Sporsmal>
    readonly statusEvent: StatusEvent
    readonly timestamp: string
}

export type UtenlandskSykmelding = {
    readonly land: string
}

export type UtdypendeOpplysning = {
    readonly restriksjoner: ReadonlyArray<SvarRestriksjon>
    readonly sporsmal?: string
    readonly svar: string
}

export enum SvarRestriksjon {}
