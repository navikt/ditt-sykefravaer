// Definer enum'en
export enum SvarRestriksjon {
    SKJERMET_FOR_ARBEIDSGIVER = 'SKJERMET_FOR_ARBEIDSGIVER',
    SKJERMET_FOR_NAV = 'SKJERMET_FOR_NAV',
}

// Definer interface
export interface UtdypendeOpplysning {
    restriksjoner: SvarRestriksjon[]
    sporsmal: string | null
    svar: string
}
