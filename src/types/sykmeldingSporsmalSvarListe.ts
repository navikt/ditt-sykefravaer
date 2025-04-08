import { ArbeidssituasjonType, FomTom } from './sykmeldingCommon'

export type Sporsmal = {
    readonly shortName: ShortName
    readonly svar: SvarTypeUnion
    readonly tekst: string
}

export type SvarTypeUnion = ArbeidssituasjonSvar | DagerSvar | JaNeiSvar | PerioderSvar

export type ArbeidssituasjonSvar = {
    readonly svar: ArbeidssituasjonType
    readonly svarType: Svartype
}

export type DagerSvar = {
    readonly svar: ReadonlyArray<string>
    readonly svarType: Svartype
}

export type PerioderSvar = {
    readonly svar: ReadonlyArray<FomTom>
    readonly svarType: Svartype
}

export type JaNeiSvar = {
    readonly svar: YesOrNo
    readonly svarType: Svartype
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

export enum YesOrNo {
    NO = 'NO',
    YES = 'YES',
}
