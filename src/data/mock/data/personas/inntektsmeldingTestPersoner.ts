import { Persona } from '../../testperson'
import { sendtSykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

export const manglerInntektsmelding: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: "Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.",
            lenke: '/syk/sykefravaer/inntektsmelding',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Manglende inntektsmelding fra arbeidsgiver etter 15 dager',
}

export const manglerInntektsmeldingVarsel2: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst:
            lenke: '/syk/sykefravaer/inntektsmelding',
                'Vi mangler fortsatt inntektsmelding fra Flex AS og har sendt en påminnelse til arbeidsgiveren din om dette.' +
                'Når vi får den kan vi begynne å behandle søknaden din.',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Manglende inntektsmelding fra arbeidsgiver etter 28 dager',
}

export const henterInntektsmeldingFraAaregMedVerdiFor3Maneder: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Status i saken din om sykepenger: Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.',
            lenke: `/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen`,
            variant: 'info',
            meldingType: 'FORELAGT_INNTEKT_FRA_AAREG',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
            metadata: {
                tidsstempel: '2022-06-16T06:52:22.419786Z',
                orgnavn: 'Snekkeri AS',
                inntekter: [
                    { maned: '2024-02', belop: 33960 },
                    { maned: '2024-01', belop: 0 },
                    { maned: '2023-12', belop: 33960 },
                ],
                omregnetAarsinntekt: 780000,
            },
        },
    ],
    beskrivelse: 'Opplysninger om inntekt hentet fra a-ordningen (3 måneder med inntekt)',
}

export const henterInntektsmeldingFraAaregMed1ManedInntekt: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y8',
            tekst: 'Status i saken din om sykepenger: Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.',
            lenke: `/syk/sykefravaer/beskjed/123456y8?testperson=forelagt-fra-a-ordningen-en-maned`,
            variant: 'info',
            meldingType: 'FORELAGT_INNTEKT_FRA_AAREG',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
            metadata: {
                tidsstempel: '2022-06-16T06:52:22.419786Z',
                orgnavn: 'Snekkeri AS',
                inntekter: [
                    { maned: '2024-02', belop: 40000 },
                    { maned: '2024-01', belop: null },
                    { maned: '2023-12', belop: null },
                ],
                omregnetAarsinntekt: 780000,
            },
        },
    ],
    beskrivelse: 'Opplysninger om inntekt hentet fra a-ordningen (1 måned med inntekt)',
}

export const henterInntektsmeldingFraAaregMedIngenManedsInntekt: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y9',
            tekst: 'Status i saken din om sykepenger: Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.',
            lenke: `/syk/sykefravaer/beskjed/123456y9?testperson=forelagt-fra-a-ordningen-ingen`,
            variant: 'info',
            meldingType: 'FORELAGT_INNTEKT_FRA_AAREG',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
            metadata: {
                tidsstempel: '2022-06-16T06:52:22.419786Z',
                orgnavn: 'Snekkeri AS',
                inntekter: [
                    { maned: '2024-03', belop: null },
                    { maned: '2024-02', belop: null },
                    { maned: '2024-01', belop: null },
                ],
                omregnetAarsinntekt: 780000,
            },
        },
    ],
    beskrivelse: 'Opplysninger om inntekt hentet fra a-ordningen (ingen inntekt)',
}

export const venterPaSaksbehandlingNummer1: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Status i saken din om sykepenger: Vi beklager! Saksbehandlingen tar dessverre lengre tid enn forventet. Vi regner med at saken din vil være ferdigbehandlet i løpet av de neste 4 ukene.',
            lenke: 'https://www.nav.no/saksbehandlingstider#sykepenger',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Venter på saksbehandlet etter 28 dager',
}

export const venterPaSaksbehandlingNummer2: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Status i saken din om sykepenger: Vi beklager! Saksbehandlingen tar dessverre lengre tid enn forventet. Vi regner med at søknaden din om sykepenger vil være ferdigbehandlet i løpet av de neste 4 ukene.',
            lenke: 'https://www.nav.no/saksbehandlingstider#sykepenger',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Revarsel om venter på saksbehandler',
}

export const mottattInntektsmelding: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Status i saken din om sykepenger: Vi venter på inntektsmelding fra Posten Norge AS.',
            variant: 'success',
            meldingType: 'mottatt inntektsmelding',
            lukkbar: true,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Oppgave når arbeidsgiver har sendt inn inntektsmelding',
}
