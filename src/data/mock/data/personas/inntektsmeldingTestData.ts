import { InntektsmeldingTyper } from '../../../../types/inntektsmeldingTyper'

export const altinnInntektsmelding: InntektsmeldingTyper = {
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
    opphoerAvNaturalytelser: [
        {
            fom: '2023-04-18',
            naturalytelse: 'AKSJERGRUNNFONDSBEVISTILUNDERKURS',
            beloepPrMnd: '1000',
        },
        {
            fom: '2023-04-18',
            naturalytelse: 'KOSTDAGER',
            beloepPrMnd: '5500',
        },
    ],
    refusjon: {
        opphoersdato: '2023-04-18',
        beloepPrMnd: '52000.00',
    },
    endringIRefusjoner: [
        {
            beloep: '52000.00',
            endringsdato: '2023-04-18',
        },
        {
            beloep: '65000.00',
            endringsdato: '2023-04-30',
        },
    ],
}

export const altinnInntektsmelding2: InntektsmeldingTyper = {
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
    opphoerAvNaturalytelser: [],
    refusjon: {},
}
