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

export const sendtSykmelding: Sykmelding = {
    id: 'SENDT',
    sykmeldingStatus: {
        statusEvent: 'SENDT',
        arbeidsgiver: {
            orgnummer: '972674818',
            orgNavn: 'Hogwarts School of Witchcraft and Wizardry',
        },
    },
    behandlingsutfall: { status: 'OK' },
    sykmeldingsperioder: [{ fom: '2021-03-01', tom: '2021-03-12' }],
    syketilfelleStartDato: '2021-03-01',
}
