import { BrukerSvar } from './sykmeldingBrukerSvar'

export type Sykmelding = {
    readonly id: string
    readonly andreTiltak?: string | null
    readonly arbeidsgiver?: ArbeidsgiverSykmelding | null
    readonly behandler?: Behandler | null
    readonly behandletTidspunkt: string
    readonly behandlingsutfall: Behandlingsutfall
    readonly egenmeldt?: boolean | null
    readonly kontaktMedPasient?: KontaktMedPasient | null
    readonly medisinskVurdering?: MedisinskVurdering | null
    readonly meldingTilArbeidsgiver?: string | null
    readonly meldingTilNAV?: MeldingTilNav | null
    readonly merknader?: Merknad[] | null
    readonly mottattTidspunkt: string
    readonly papirsykmelding?: boolean | null
    readonly pasient?: Pasient | null
    readonly prognose?: Prognose | null
    readonly rulesetVersion: number
    readonly sykmeldingStatus: SykmeldingStatus
    readonly sykmeldingsperioder: Periode[]
    readonly tiltakArbeidsplassen?: string | null
    readonly tiltakNAV?: string | null
    readonly utdypendeOpplysninger: Record<string, Record<string, UtdypendeOpplysning>>
    readonly utenlandskSykmelding?: UtenlandskSykmelding | null
}

export type ArbeidsgiverSykmelding = {
    readonly navn?: string | null
}

export type Behandler = {
    readonly adresse?: Adresse | null
    readonly etternavn: string
    readonly fornavn: string
    readonly mellomnavn?: string | null
    readonly tlf?: string | null
}

export type Adresse = {
    readonly gate?: string | null
    readonly kommune?: string | null
    readonly land?: string | null
    readonly postboks?: string | null
    readonly postnummer?: number | null
}

export type Behandlingsutfall = {
    readonly ruleHits: RegelInfo[]
    readonly status: RegelStatus
}

export type AktivitetIkkeMuligPeriode = {
    readonly arbeidsrelatertArsak?: ArbeidsrelatertArsak | null
    readonly medisinskArsak?: MedisinskArsak | null
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
    readonly beskrivelse?: string | null
    readonly grunn: AnnenFraverGrunn[]
}

export type ArbeidsgiverStatus = {
    readonly orgNavn: string
    readonly orgnummer: string
}

export type ArbeidsrelatertArsak = {
    readonly arsak: ArbeidsrelatertArsakType[]
    readonly beskrivelse?: string | null
}

export enum ArbeidsrelatertArsakType {
    ANNET = 'ANNET',
    MANGLENDE_TILRETTELEGGING = 'MANGLENDE_TILRETTELEGGING',
}

export type Diagnose = {
    readonly kode: string
    readonly system: string
    readonly tekst?: string | null
}

export type ErIArbeid = {
    readonly annetArbeidPaSikt: boolean
    readonly arbeidFOM?: string | null
    readonly egetArbeidPaSikt: boolean
    readonly vurderingsdato?: string | null
}

export type ErIkkeIArbeid = {
    readonly arbeidsforFOM?: string | null
    readonly arbeidsforPaSikt: boolean
    readonly vurderingsdato?: string | null
}

export type GradertPeriode = {
    readonly grad: number
    readonly reisetilskudd: boolean
}

export type KontaktMedPasient = {
    readonly begrunnelseIkkeKontakt?: string | null
    readonly kontaktDato?: string | null
}

export type MedisinskArsak = {
    readonly arsak: MedisinskArsakType[]
    readonly beskrivelse?: string | null
}

export enum MedisinskArsakType {
    AKTIVITET_FORHINDRER_BEDRING = 'AKTIVITET_FORHINDRER_BEDRING',
    AKTIVITET_FORVERRER_TILSTAND = 'AKTIVITET_FORVERRER_TILSTAND',
    ANNET = 'ANNET',
    TILSTAND_HINDRER_AKTIVITET = 'TILSTAND_HINDRER_AKTIVITET',
}

export type MedisinskVurdering = {
    readonly annenFraversArsak?: AnnenFraversArsak | null
    readonly biDiagnoser: Diagnose[]
    readonly hovedDiagnose?: Diagnose | null
    readonly svangerskap: boolean
    readonly yrkesskade: boolean
    readonly yrkesskadeDato?: string | null
}

export type MeldingTilNav = {
    readonly beskrivBistand?: string | null
    readonly bistandUmiddelbart: boolean
}

export type Merknad = {
    readonly beskrivelse?: string | null
    readonly type: Merknadtype
}

export enum Merknadtype {
    DELVIS_GODKJENT = 'DELVIS_GODKJENT',
    TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER = 'TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER',
    UGYLDIG_TILBAKEDATERING = 'UGYLDIG_TILBAKEDATERING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
}

export type Pasient = {
    readonly etternavn?: string | null
    readonly fnr?: string | null
    readonly fornavn?: string | null
    readonly mellomnavn?: string | null
    readonly overSyttiAar?: boolean | null
}

export type Periode = {
    readonly type: Periodetype
    readonly fom: string
    readonly tom: string
    readonly aktivitetIkkeMulig?: AktivitetIkkeMuligPeriode | null
    readonly behandlingsdager?: number | null
    readonly gradert?: GradertPeriode | null
    readonly innspillTilArbeidsgiver?: string | null
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
    readonly erIArbeid?: ErIArbeid | null
    readonly erIkkeIArbeid?: ErIkkeIArbeid | null
    readonly hensynArbeidsplassen?: string | null
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
    readonly arbeidsgiver?: ArbeidsgiverStatus | null
    readonly brukerSvar?: BrukerSvar | null
    readonly statusEvent: StatusEvent
    readonly timestamp: string
}

export type UtenlandskSykmelding = {
    readonly land: string
}

export type UtdypendeOpplysning = {
    readonly restriksjoner: SvarRestriksjon[]
    readonly sporsmal?: string | null
    readonly svar: string
}

export enum SvarRestriksjon {
    SKJERMET_FOR_ARBEIDSGIVER = 'SKJERMET_FOR_ARBEIDSGIVER',
    SKJERMET_FOR_NAV = 'SKJERMET_FOR_NAV',
}
