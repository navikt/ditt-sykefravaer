export interface NaermesteLeder {
    navn: string
}

export interface Arbeidsgiver {
    orgnummer: string
    navn: string
    aktivtArbeidsforhold: boolean
    naermesteLeder: NaermesteLeder | null
}
