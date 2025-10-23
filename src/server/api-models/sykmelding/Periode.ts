import { ArbeidsrelatertArsakType, MedisinskArsakType, Periodetype } from '../../../types/sykmelding'

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

export interface GradertPeriode {
    grad: number
    reisetilskudd: boolean
}

export interface AktivitetIkkeMuligPeriode {
    medisinskArsak: MedisinskArsak | null
    arbeidsrelatertArsak: ArbeidsrelatertArsak | null
}

export interface MedisinskArsak {
    beskrivelse: string | null
    arsak: MedisinskArsakType[]
}

export interface ArbeidsrelatertArsak {
    beskrivelse: string | null
    arsak: ArbeidsrelatertArsakType[]
}
