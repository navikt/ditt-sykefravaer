import { ArbeidsrelatertArsakType, MedisinskArsakType, Periodetype } from '../../../fetching/graphql.generated'

// --------------------------------------------------
// 1) GradertPeriode
// --------------------------------------------------
export interface GradertPeriode {
    grad: number
    reisetilskudd: boolean
}

// --------------------------------------------------
// 2) MedisinskArsak
// --------------------------------------------------
export interface MedisinskArsak {
    beskrivelse: string | null
    arsak: MedisinskArsakType[]
}

// --------------------------------------------------
// 3) ArbeidsrelatertArsak
// --------------------------------------------------
export interface ArbeidsrelatertArsak {
    beskrivelse: string | null
    arsak: ArbeidsrelatertArsakType[]
}

// --------------------------------------------------
// 4) AktivitetIkkeMuligPeriode
// --------------------------------------------------
export interface AktivitetIkkeMuligPeriode {
    medisinskArsak: MedisinskArsak | null
    arbeidsrelatertArsak: ArbeidsrelatertArsak | null
}

// --------------------------------------------------
// 5) Periode
// --------------------------------------------------
export interface Periode {
    fom: string
    tom: string
    gradert: GradertPeriode | null
    behandlingsdager: number | null
    innspillTilArbeidsgiver: string | null
    type: Periodetype
    aktivitetIkkeMulig: AktivitetIkkeMuligPeriode | null
    reisetilskudd: boolean
}
