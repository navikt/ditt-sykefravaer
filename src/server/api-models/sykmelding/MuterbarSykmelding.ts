// Anta at LocalDate er en streng med format "YYYY-MM-DD"
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

export type LocalDate = string

// -- Eksempel på andre typer, hentet fra dine tidligere definisjoner --
// import { Behandlingsutfall } from './Behandlingsutfall'
// import { ArbeidsgiverSykmelding } from './ArbeidsgiverSykmelding'
// import { Periode } from './Periode'
// import { SykmeldingStatus } from './SykmeldingStatus'
// import { MedisinskVurdering } from './MedisinskVurdering'
// import { Prognose } from './Prognose'
// import { UtdypendeOpplysning } from './UtdypendeOpplysninger'
// import { MeldingTilNAV } from './MeldingTilNav'
// import { KontaktMedPasient } from './KontaktMedPasient'
// import { Behandler } from './Behandler'
// import { Merknad } from './Merknad'
// import { Pasient } from './Pasient'
// import { UtenlandskSykmelding } from './UtenlandskSykmelding'

/**
 * Dersom du ønsker å beholde funksjonaliteten fra
 *   `RulesetVersion = z.preprocess(...)`,
 * kan du bare definere `rulesetVersion` som `number`,
 * og eventuelt håndtere default-verdien (2) i koden din
 * i stedet for i selve type‐definisjonen.
 */
export interface MuterbarSykmelding {
    id: string
    mottattTidspunkt: LocalDate
    behandlingsutfall: Behandlingsutfall
    arbeidsgiver: ArbeidsgiverSykmelding | null
    sykmeldingsperioder: Periode[]
    sykmeldingStatus: SykmeldingStatus
    medisinskVurdering: MedisinskVurdering | null
    prognose: Prognose | null
    /**
     * Tilsvarer
     *   z.record(z.string(), z.record(z.string(), UtdypendeOpplysningSchema))
     * altså et objekt av form:
     *   { [key: string]: { [key: string]: UtdypendeOpplysning } }
     */
    utdypendeOpplysninger: Record<string, Record<string, UtdypendeOpplysning>>
    tiltakArbeidsplassen: string | null
    tiltakNAV: string | null
    andreTiltak: string | null
    meldingTilNAV: MeldingTilNAV | null
    meldingTilArbeidsgiver: string | null
    kontaktMedPasient: KontaktMedPasient | null
    behandletTidspunkt: LocalDate
    behandler: Behandler
    egenmeldt: boolean | null
    papirsykmelding: boolean | null
    merknader: Merknad[] | null
    pasient: Pasient | null
    rulesetVersion: number
    utenlandskSykmelding: UtenlandskSykmelding | null
}
