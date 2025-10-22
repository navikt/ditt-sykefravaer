// Anta at LocalDate er en streng med format "YYYY-MM-DD"
import { Sykmelding } from '../../../types/sykmelding'

import { MeldingTilNAV } from './MeldingTilNav'
import { KontaktMedPasient } from './KontaktMedPasient'
import { Behandler } from './Behandler'
import { Merknad } from './Merknad'
import { Pasient } from './Pasient'
import { UtenlandskSykmelding } from './UtenlandskSykmelding'
import { UtdypendeOpplysning } from './UtdypendeOpplysninger'
import { Behandlingsutfall } from './Behandlingsutfall'
import { ArbeidsgiverSykmelding } from './ArbeidsgiverSykmelding'
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
