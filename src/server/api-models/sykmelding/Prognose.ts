export interface ErIArbeid {
    egetArbeidPaSikt: boolean
    annetArbeidPaSikt: boolean
    arbeidFOM: string | null
    vurderingsdato: string | null
}

export interface ErIkkeIArbeid {
    arbeidsforPaSikt: boolean
    arbeidsforFOM: string | null
    vurderingsdato: string | null
}

export interface Prognose {
    arbeidsforEtterPeriode: boolean
    hensynArbeidsplassen: string | null
    erIArbeid: ErIArbeid | null
    erIkkeIArbeid: ErIkkeIArbeid | null
}
