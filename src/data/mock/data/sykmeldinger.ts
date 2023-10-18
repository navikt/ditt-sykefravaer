import dayjs from 'dayjs'

import { Sykmelding } from '../../../types/sykmelding'

export const nySykmelding: Sykmelding = {
    id: 'APEN',
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

const orgNavn = 'hogwart ';
export const sendtSykmelding: Sykmelding = {
    id: 'SENDT',
    sykmeldingStatus: {
        statusEvent: 'SENDT',
        arbeidsgiver: {
            orgnummer: '972674818',
            orgNavn: 'hogwart hogwart hogwart hogwart hogwart hogwart hogwart hogwart hogwart hogwart ',
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

export const bekreftetSykmelding: Sykmelding = {
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
}

export const avvistSykmelding: Sykmelding = {
    id: 'AVVIST',
    sykmeldingStatus: { statusEvent: 'APEN' },
    behandlingsutfall: { status: 'INVALID' },
    sykmeldingsperioder: [{ fom: '2021-03-19', tom: '2021-03-19' }],
    syketilfelleStartDato: '2021-03-01',
}
