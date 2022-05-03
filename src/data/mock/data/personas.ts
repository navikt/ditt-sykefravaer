import dayjs from 'dayjs'

import { brev } from './brev'
import { enTomDialogmote } from './dialogmoter'
import {
    avbrutt,
    avventendeUnderArbeid,
    nyUnderArbeid,
    utdatert,
} from './oppfolgingsplaner'
import { Persona } from './persona'
import { soknader } from './soknader'
import { nySykmelding, sendtSykmelding } from './sykmeldinger'
import { vedtakMed100Grad } from './vedtak'

export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [],
    hendelser: [],
    brev: [],
}

export const enNySykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [nySykmelding],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [
        {
            oppfolgingsdato: dayjs().format('YYYY-MM-DD'),
            sykmeldinger: [
                {
                    fom: dayjs().format('YYYY-MM-DD'),
                    tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
                },
            ],
        },
    ],
    hendelser: [],
    brev: [],
}

export const enAvvistSykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [
        {
            id: 'AVVIST',
            sykmeldingStatus: { statusEvent: 'APEN' },
            behandlingsutfall: { status: 'INVALID' },
            sykmeldingsperioder: [{ fom: '2021-03-01', tom: '2021-03-12' }],
            syketilfelleStartDato: '2021-03-01',
        },
    ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [],
    hendelser: [],
    brev: [],
}

export const defaultPersona: Persona = {
    soknader: soknader,
    vedtak: [vedtakMed100Grad],
    oppfolgingsplaner: [
        nyUnderArbeid,
        utdatert,
        avbrutt,
        avventendeUnderArbeid,
    ],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [
        sendtSykmelding,
        {
            id: 'APEN',
            sykmeldingStatus: {
                statusEvent: 'BEKREFTET',
                sporsmalOgSvarListe: [
                    {
                        shortName: 'FORSIKRING',
                        svar: { svarType: 'JA_NEI', svar: 'JA' },
                    },
                    {
                        shortName: 'FRAVAER',
                        svar: { svarType: 'JA_NEI', svar: 'NEI' },
                    },
                    {
                        shortName: 'ARBEIDSSITUASJON',
                        svar: {
                            svarType: 'ARBEIDSSITUASJON',
                            svar: 'FRILANSER',
                        },
                    },
                ],
            },
            behandlingsutfall: { status: 'OK' },
            sykmeldingsperioder: [{ fom: '2021-03-15', tom: '2021-03-19' }],
            syketilfelleStartDato: '2021-03-01',
        },
        {
            id: 'AVVIST',
            sykmeldingStatus: { statusEvent: 'APEN' },
            behandlingsutfall: { status: 'INVALID' },
            sykmeldingsperioder: [{ fom: '2021-03-19', tom: '2021-03-19' }],
            syketilfelleStartDato: '2021-03-01',
        },
    ],
    narmesteledere: [
        {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: '2021-03-19',
        },
    ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true },
    sykeforloep: [
        {
            oppfolgingsdato: '2021-03-01',
            sykmeldinger: [
                { fom: '2021-03-01', tom: '2021-03-12' },
                { fom: '2021-03-15', tom: '2021-03-19' },
            ],
        },
    ],
    hendelser: [
        { type: 'AKTIVITETSKRAV_VARSEL', inntruffetdato: '2021-03-03' },
    ],
    brev: brev,
}
