import dayjs from 'dayjs'

import { TsmSykmelding } from '../../../types/tsmSykmelding'

export const nySykmelding: TsmSykmelding = {
    id: 'id-apen-sykmelding',
    sykmeldingStatus: { statusEvent: 'APEN' },
    behandlingsutfall: { status: 'OK' },
    sykmeldingsperioder: [
        {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
        },
    ],
    syketilfelleStartDato: dayjs().format('YYYY-MM-DD'),
}

export const sendtSykmelding: TsmSykmelding = {
    id: 'id-1',
    sykmeldingStatus: {
        statusEvent: 'SENDT',
        arbeidsgiver: {
            orgnummer: '972674818',
            orgNavn: 'Hogwarts School of Witchcraft and Wizardry',
        },
    },
    behandlingsutfall: { status: 'OK' },
    sykmeldingsperioder: [
        {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
        },
    ],
    syketilfelleStartDato: dayjs().format('YYYY-MM-DD'),
}

export const bekreftetSykmelding: TsmSykmelding = {
    id: 'id-2',
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
}

export const avvistSykmelding: TsmSykmelding = {
    id: 'id-3',
    sykmeldingStatus: { statusEvent: 'APEN' },
    behandlingsutfall: { status: 'INVALID' },
    sykmeldingsperioder: [{ fom: '2021-03-19', tom: '2021-03-19' }],
    syketilfelleStartDato: '2021-03-01',
}
