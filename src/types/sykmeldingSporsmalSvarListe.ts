import { ArbeidssituasjonType, FomTom, YesOrNo } from './sykmeldingCommon'

export type Sporsmal = {
    readonly shortName: ShortName
    readonly svar: SvarTypeUnion
    readonly tekst: string
}

export type SvarTypeUnion = ArbeidssituasjonSvar | DagerSvar | JaNeiSvar | PerioderSvar

export type ArbeidssituasjonSvar = {
    readonly svar: ArbeidssituasjonType
    readonly svarType: Svartype.ARBEIDSSITUASJON
}

export type DagerSvar = {
    readonly svar: string[]
    readonly svarType: Svartype.DAGER
}

export type PerioderSvar = {
    readonly svar: FomTom[]
    readonly svarType: Svartype.PERIODER
}

export type JaNeiSvar = {
    readonly svar: YesOrNo
    readonly svarType: Svartype.JA_NEI
}

export enum Svartype {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    DAGER = 'DAGER',
    JA_NEI = 'JA_NEI',
    PERIODER = 'PERIODER',
}

export enum ShortName {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    EGENMELDINGSDAGER = 'EGENMELDINGSDAGER',
    FORSIKRING = 'FORSIKRING',
    FRAVAER = 'FRAVAER',
    NY_NARMESTE_LEDER = 'NY_NARMESTE_LEDER',
    PERIODE = 'PERIODE',
}
