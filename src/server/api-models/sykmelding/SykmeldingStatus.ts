// Eksempel på import av enum-ene dine fra GraphQL-autogenerert kode eller egne filer.
// Du kan tilpasse dette til ditt prosjekt.
import { StatusEvent } from '../../../types/sykmelding'
import { ArbeidssituasjonType, Blad, LottOgHyre } from '../../../types/sykmeldingCommon'
import { JaEllerNei, UriktigeOpplysningerType } from '../../../types/sykmeldingBrukerSvar'

// Anta at du bruker en streng for LocalDate (f.eks. "YYYY-MM-DD").
export type LocalDate = string

export interface ArbeidsgiverStatus {
    orgnummer: string
    orgNavn: string
}

export interface SporsmalSvar<T> {
    sporsmaltekst: string
    svar: T
}

export interface BrukerSvar {
    erOpplysningeneRiktige: SporsmalSvar<JaEllerNei>
    uriktigeOpplysninger: SporsmalSvar<UriktigeOpplysningerType[]> | null
    arbeidssituasjon: SporsmalSvar<ArbeidssituasjonType>
    arbeidsgiverOrgnummer: SporsmalSvar<string> | null
    riktigNarmesteLeder: SporsmalSvar<JaEllerNei> | null
    harBruktEgenmelding: SporsmalSvar<JaEllerNei> | null
    egenmeldingsperioder: SporsmalSvar<Array<{ fom: LocalDate; tom: LocalDate }>> | null
    harForsikring: SporsmalSvar<JaEllerNei> | null
    egenmeldingsdager: SporsmalSvar<LocalDate[]> | null
    harBruktEgenmeldingsdager: SporsmalSvar<JaEllerNei> | null
    fisker: {
        blad: SporsmalSvar<Blad>
        lottOgHyre: SporsmalSvar<LottOgHyre>
    } | null
    arbeidsledig: {
        arbeidsledigFraOrgnummer: SporsmalSvar<string> | null
    } | null
}

export interface SykmeldingStatus {
    statusEvent: StatusEvent
    timestamp: LocalDate
    arbeidsgiver: ArbeidsgiverStatus | null
    brukerSvar: BrukerSvar | null
}
