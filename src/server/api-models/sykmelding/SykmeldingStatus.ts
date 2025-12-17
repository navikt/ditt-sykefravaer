import { StatusEvent } from '../../../types/sykmelding/sykmelding'
import { ArbeidssituasjonType, Blad, LottOgHyre } from '../../../types/sykmelding/sykmeldingCommon'
import { JaEllerNei, UriktigeOpplysningerType } from '../../../types/sykmelding/sykmeldingBrukerSvar'

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
    sykFoerSykmeldingen: SporsmalSvar<JaEllerNei> | null
    harBruktEgenmelding: SporsmalSvar<JaEllerNei> | null
    egenmeldingsperioder: SporsmalSvar<Array<{ fom: string; tom: string }>> | null
    harForsikring: SporsmalSvar<JaEllerNei> | null
    egenmeldingsdager: SporsmalSvar<string[]> | null
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
    timestamp: string
    arbeidsgiver: ArbeidsgiverStatus | null
    brukerSvar: BrukerSvar | null
}
