export interface ErUtenforVentetid {
    erUtenforVentetid: boolean
    oppfolgingsdato: string | null
    ventetid: FomTomPeriode | null
}

export interface FomTomPeriode {
    fom: string
    tom: string
}
