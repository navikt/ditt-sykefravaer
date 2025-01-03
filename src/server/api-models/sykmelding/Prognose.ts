// date.ts
export type LocalDate = string
// eller et annet format om du ønsker

// --------------------------------------------------
// 1) ErIArbeid
// --------------------------------------------------
export interface ErIArbeid {
    egetArbeidPaSikt: boolean
    annetArbeidPaSikt: boolean
    arbeidFOM: LocalDate | null
    vurderingsdato: LocalDate | null
}

// --------------------------------------------------
// 2) ErIkkeIArbeid
// --------------------------------------------------
export interface ErIkkeIArbeid {
    arbeidsforPaSikt: boolean
    arbeidsforFOM: LocalDate | null
    vurderingsdato: LocalDate | null
}

// --------------------------------------------------
// 3) Prognose
// --------------------------------------------------
export interface Prognose {
    arbeidsforEtterPeriode: boolean
    hensynArbeidsplassen: string | null
    erIArbeid: ErIArbeid | null
    erIkkeIArbeid: ErIkkeIArbeid | null
}
