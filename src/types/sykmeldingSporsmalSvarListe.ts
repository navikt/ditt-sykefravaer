export type DagerSvar = {
    readonly svar: string[]
    readonly svarType: Svartype.DAGER
}

export enum Svartype {
    ARBEIDSSITUASJON = 'ARBEIDSSITUASJON',
    DAGER = 'DAGER',
    JA_NEI = 'JA_NEI',
    PERIODER = 'PERIODER',
}
