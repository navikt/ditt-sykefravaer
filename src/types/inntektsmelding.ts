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
    opphoerAvNaturalytelser: OpphoerAvNaturalytelser[]
}

export interface Periode {
    fom: string
    tom: string
}

export interface OpphoerAvNaturalytelser {
    fom?: string
    natuiralytelse: string
}
