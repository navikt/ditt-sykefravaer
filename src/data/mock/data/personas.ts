import dayjs from 'dayjs'

import { dialogmoteSkjema,enTomDialogmote } from './dialogmoter'
import { avbrutt, avventendeUnderArbeid, nyUnderArbeid, utdatert } from './oppfolgingsplaner'
import { Persona } from './persona'
import { soknader } from './soknader'
import { vedtakMed100Grad } from './vedtak'


export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
    sykmeldinger: [],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [],
    hendelser: [],
}

export const enNySykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
        } ],
        syketilfelleStartDato: dayjs().format('YYYY-MM-DD'),
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [ {
        oppfolgingsdato: dayjs().format('YYYY-MM-DD'),
        sykmeldinger: [ {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD')
        } ]
    } ],
    hendelser: [],
}

export const enAvvistSykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
    sykmeldinger: [ {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
        syketilfelleStartDato: '2021-03-01',
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    sykeforloep: [],
    hendelser: [],
}

export const defaultPersona: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    oppfolgingsplaner: [ nyUnderArbeid, utdatert, avbrutt, avventendeUnderArbeid ],
    dialogmote: dialogmoteSkjema,
    dialogmoteBehov: {
        visMotebehov: true,
        skjemaType: 'SVAR_BEHOV',
        harMotebehov: false
    },
    sykmeldinger: [ {
        id: 'SENDT',
        sykmeldingStatus: {
            statusEvent: 'SENDT',
            arbeidsgiver: { orgnummer: '972674818', orgNavn: 'Hogwarts School of Witchcraft and Wizardry' }
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
        syketilfelleStartDato: '2021-03-01',
    }, {
        id: 'APEN',
        sykmeldingStatus: {
            statusEvent: 'BEKREFTET',
            sporsmalOgSvarListe: [
                {
                    shortName: 'FORSIKRING',
                    svar: { svarType: 'JA_NEI', svar: 'JA' }
                },
                {
                    shortName: 'FRAVAER',
                    svar: { svarType: 'JA_NEI', svar: 'NEI' }
                },
                {
                    shortName: 'ARBEIDSSITUASJON',
                    svar: { svarType: 'ARBEIDSSITUASJON', svar: 'FRILANSER' }
                }
            ]
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-15', tom: '2021-03-19' } ],
        syketilfelleStartDato: '2021-03-01',
    }, {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' },
        sykmeldingsperioder: [ { fom: '2021-03-19', tom: '2021-03-19' } ],
        syketilfelleStartDato: '2021-03-01',
    } ],
    narmesteledere: [ {
        navn: 'Albus Dumbledore',
        orgnummer: '972674818',
        arbeidsgiverForskutterer: true,
        aktivFom: '2021-03-19'
    } ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true },
    sykeforloep: [ {
        oppfolgingsdato: '2021-03-01',
        sykmeldinger: [
            { fom: '2021-03-01', tom: '2021-03-12' },
            { fom: '2021-03-15', tom: '2021-03-19' },
        ]
    } ],
    hendelser: [],
}
