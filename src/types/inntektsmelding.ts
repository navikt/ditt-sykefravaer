export interface Inntektsmelding {
    innsenderTelefonNr: string
    innsenderNavn: string
    inntektsmeldingId: string
    beregnetInntekt: string
    status: string
    foersteFravaersdag: string
    mottattDato: string
    organisasjonsnavn: string
    virksomhetsnummer: string
    arbeidsgiverperioder: Periode[]
}

export interface Periode {
    fom: string
    tom: string
}
