import { Inntektsmelding } from '../../../../types/inntektsmelding'

export const altinnInntektsmelding: Inntektsmelding = {
    arbeidsgiverperioder: [],
    innsenderNavn: 'Pål Dagfinn R',
    innsenderTelefonNr: '123432232',
    virksomhetsnummer: '999999999',
    inntektsmeldingId: '67e56f3c-6eee-4378-b9e3-ad8be6b7a905',
    beregnetInntekt: '52000.00',
    status: 'GYLDIG',
    foersteFravaersdag: '2023-04-18',
    mottattDato: '2023-05-16T08:49:43',
    organisasjonsnavn: 'Matbutikken AS, Kjelsås',
}

export const altinnInntektsmelding2: Inntektsmelding = {
    arbeidsgiverperioder: [
        { fom: '2023-04-18', tom: '2023-04-18' },
        { fom: '2023-04-10', tom: '2023-04-15' },
    ],
    innsenderNavn: 'Pål Dagfinn R',
    innsenderTelefonNr: '123432232',
    virksomhetsnummer: '999999999',
    inntektsmeldingId: '67e56f3c-6eee-4378-b9e3-ad8be6b7a988',
    beregnetInntekt: '52000.00',
    status: 'GYLDIG',
    foersteFravaersdag: '2023-04-18',
    mottattDato: '2023-05-13T08:49:43',
    organisasjonsnavn: 'Matbutikken AS, Grefsen',
}
