import { Merknadtype, SvarRestriksjon, Sykmelding } from '../../../types/sykmelding/sykmelding'

import { Behandler } from './Behandler'
import { Behandlingsutfall } from './Behandlingsutfall'
import { SykmeldingStatus } from './SykmeldingStatus'
import { Periode } from './Periode'
import { MedisinskVurdering } from './MedisinskVurdering'
import { Prognose } from './Prognose'

export interface MuterbarSykmelding extends Sykmelding {
    id: string
    andreTiltak: string | null
    arbeidsgiver: ArbeidsgiverSykmelding | null
    behandler: Behandler
    behandletTidspunkt: string
    behandlingsutfall: Behandlingsutfall
    egenmeldt: boolean | null
    kontaktMedPasient: KontaktMedPasient | null
    medisinskVurdering: MedisinskVurdering | null
    meldingTilArbeidsgiver: string | null
    meldingTilNAV: MeldingTilNAV | null
    merknader: Merknad[] | null
    mottattTidspunkt: string
    papirsykmelding: boolean | null
    pasient: Pasient | null
    prognose: Prognose | null
    rulesetVersion: number
    sykmeldingStatus: SykmeldingStatus
    sykmeldingsperioder: Periode[]
    tiltakArbeidsplassen: string | null
    tiltakNAV: string | null
    utdypendeOpplysninger: Record<string, Record<string, UtdypendeOpplysning>>
    utenlandskSykmelding: UtenlandskSykmelding | null
}

export interface UtdypendeOpplysning {
    restriksjoner: SvarRestriksjon[]
    sporsmal: string | null
    svar: string
}

export interface Merknad {
    type: Merknadtype
    beskrivelse: string | null
}

export interface Pasient {
    fnr: string | null
    fornavn: string | null
    mellomnavn: string | null
    etternavn: string | null
    overSyttiAar: boolean | null
}

export interface MeldingTilNAV {
    bistandUmiddelbart: boolean
    beskrivBistand: string | null
}

export interface KontaktMedPasient {
    kontaktDato: string | null
    begrunnelseIkkeKontakt: string | null
}

export interface ArbeidsgiverSykmelding {
    navn: string | null
}

export interface UtenlandskSykmelding {
    land: string
}
