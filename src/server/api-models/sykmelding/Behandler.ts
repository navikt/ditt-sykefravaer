export interface Adresse {
    gate: string | null
    postnummer: number | null
    kommune: string | null
    postboks: string | null
    land: string | null
}

export interface Behandler {
    fornavn: string
    mellomnavn: string | null
    etternavn: string
    adresse: Adresse
    tlf: string | null
}
