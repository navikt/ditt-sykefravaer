export type Brukerinformasjon = {
    readonly arbeidsgivere: Arbeidsgiver[]
}

export type Arbeidsgiver = {
    readonly aktivtArbeidsforhold: boolean
    readonly naermesteLeder?: NaermesteLeder | null
    navn: string
    readonly orgnummer: string
}

export type NaermesteLeder = {
    readonly navn: string
}
