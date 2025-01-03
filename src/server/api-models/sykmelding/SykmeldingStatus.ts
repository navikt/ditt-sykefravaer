// Eksempel på import av enum-ene dine fra GraphQL-autogenerert kode eller egne filer.
// Du kan tilpasse dette til ditt prosjekt.
import {
    ShortName,
    StatusEvent,
    UriktigeOpplysningerType,
    ArbeidssituasjonType,
    YesOrNo,
    Blad,
    LottOgHyre,
    JaEllerNei,
} from '../../../fetching/graphql.generated'

// Anta at du bruker en streng for LocalDate (f.eks. "YYYY-MM-DD").
export type LocalDate = string

// --------------------------------------------------
// 1) Svartype
// --------------------------------------------------
export enum Svartype {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    PERIODER = 'PERIODER',
    JA_NEI = 'JA_NEI',
    DAGER = 'DAGER',
}

// --------------------------------------------------
// 2) ArbeidsgiverStatus
// --------------------------------------------------
export interface ArbeidsgiverStatus {
    orgnummer: string
    orgNavn: string
}

// --------------------------------------------------
// 3) Ulike varianter av "Svar"
// --------------------------------------------------
/**
 * I Zod-koden utføres en transform fra JaEllerNei -> YesOrNo.
 * Sluttresultatet er altså YesOrNo i `svar`.
 */
export interface JaNeiSvar {
    svarType: Svartype.JA_NEI
    svar: YesOrNo
}

/**
 * Her parses en JSON-streng til en array av LocalDate,
 * så sluttresultatet er bare `LocalDate[]`.
 */
export interface DagerSvar {
    svarType: Svartype.DAGER
    svar: LocalDate[]
}

/**
 * En enkel enum-verdi uten transform.
 */
export interface ArbeidssituasjonSvar {
    svarType: Svartype.ARBEIDSSITUASJON
    svar: ArbeidssituasjonType
}

/**
 * Her parses en JSON-streng til en array av perioder (fom/tom),
 * så sluttresultatet er et array av objekter.
 */
export interface Periode {
    fom: LocalDate
    tom: LocalDate
}

export interface PerioderSvar {
    svarType: Svartype.PERIODER
    svar: Periode[]
}

/**
 * For å matche SvarSchema som en `discriminatedUnion` i Zod,
 * definerer vi en union av grensesnittene over.
 */
export type Svar = JaNeiSvar | DagerSvar | ArbeidssituasjonSvar | PerioderSvar

// --------------------------------------------------
// 4) Sporsmal
// --------------------------------------------------
export interface Sporsmal {
    tekst: string
    shortName: ShortName
    svar: Svar
}

// --------------------------------------------------
// 5) SporsmalSvar<T>
// --------------------------------------------------
/**
 * Motsvar til `SporsmalSvarSchema` som tar en generisk `T` i Zod.
 */
export interface SporsmalSvar<T> {
    sporsmaltekst: string
    svar: T
}

// --------------------------------------------------
// 6) BrukerSvar
// --------------------------------------------------
/**
 * Motsvarer BrukerSvarSchema, med felt som enten er obligatoriske
 * eller nullable i henhold til Zod-skjemaet.
 */
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

// --------------------------------------------------
// 7) SykmeldingStatus
// --------------------------------------------------
export interface SykmeldingStatus {
    statusEvent: StatusEvent
    timestamp: LocalDate
    arbeidsgiver: ArbeidsgiverStatus | null
    sporsmalOgSvarListe: Sporsmal[]
    brukerSvar: BrukerSvar | null
}
