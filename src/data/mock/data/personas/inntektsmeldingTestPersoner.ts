import { Persona } from '../../testperson'
import { sendtSykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

export const manglerInntektsmelding: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.',
            lenke: '/syk/sykefravaer/inntektsmelding',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person som har varsel om manglende inntektsmelding fra arbeidsgiver etter 15 dager',
}

export const manglerInntektsmeldingVarsel2: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Saksbehandlingen er forsinket fordi vi fortsatt mangler inntektsmelding fra Matbutikken AS. Etter vi har mottatt inntektsmelding vil søknaden forhåpentligvis være ferdigbehandlet innen 4 uker.',
            lenke: '/syk/sykefravaer/inntektsmelding',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person som har varsel om manglende inntektsmelding fra arbeidsgiver etter 28 dager',
}

export const venterPaSaksbehandlingNummer1: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Behandlingen av søknaden din om sykepenger tar lengre tid enn forventet. Vi beklager eventuelle ulemper dette medfører. Se vår oversikt over normal saksbehandlingstid.',
            lenke: 'https://www.nav.no/saksbehandlingstider#sykepenger',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person som har varsel om venter på saksbehandlet etter 28 dager',
}

export const venterPaSaksbehandlingNummer2: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Beklager, men behandlingen av søknaden din om sykepenger tar enda lengre tid enn forventet. Vi beklager eventuelle ulemper dette medfører.',
            lenke: 'https://www.nav.no/saksbehandlingstider#sykepenger',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person som har revarsel om venter på saksbehandlet',
}

export const mottattInntektsmelding: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.',
            variant: 'success',
            meldingType: 'mottatt inntektsmelding',
            lukkbar: true,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person som har oppgave når arbeidsgiver har sendt inn inntektsmelding',
}
