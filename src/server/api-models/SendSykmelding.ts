import { ArbeidssituasjonType, JaEllerNei, UriktigeOpplysningerType } from 'queries'

export type SykmeldingUserEventV3Api = {
    erOpplysningeneRiktige: SporsmalSvar<JaEllerNei>
    uriktigeOpplysninger: SporsmalSvar<ReadonlyArray<UriktigeOpplysningerType>> | null
    arbeidssituasjon: SporsmalSvar<ArbeidssituasjonType>
    arbeidsgiverOrgnummer: SporsmalSvar<string> | null
    riktigNarmesteLeder: SporsmalSvar<JaEllerNei> | null
    harBruktEgenmelding: SporsmalSvar<JaEllerNei> | null
    egenmeldingsperioder: SporsmalSvar<Array<EgenmeldingsperiodeV3>> | null
    harForsikring: SporsmalSvar<JaEllerNei> | null
    egenmeldingsdager: SporsmalSvar<ReadonlyArray<string>> | null
    harBruktEgenmeldingsdager: SporsmalSvar<JaEllerNei> | null
    fisker: {
        blad: SporsmalSvar<'A' | 'B'>
        lottOgHyre: SporsmalSvar<'LOTT' | 'HYRE' | 'BEGGE'>
    } | null
    arbeidsledig: {
        arbeidsledigFraOrgnummer: SporsmalSvar<string>
    } | null
}

type SporsmalSvar<T> = {
    sporsmaltekst: string
    svar: T
}

type EgenmeldingsperiodeV3 = {
    fom: string
    tom: string
}
