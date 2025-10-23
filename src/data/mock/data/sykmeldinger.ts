import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../../types/dittSykefravaerSykmelding'
import { StatusEvent, RegelStatus } from '../../../types/sykmelding'

export const nySykmelding: DittSykefravaerSykmelding = {
    id: 'id-apen-sykmelding',
    sykmeldingStatus: { statusEvent: StatusEvent.APEN },
    behandlingsutfall: { status: RegelStatus.OK },
    sykmeldingsperioder: [
        {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
        },
    ],
    syketilfelleStartDato: dayjs().format('YYYY-MM-DD'),
}

export const sendtSykmelding: DittSykefravaerSykmelding = {
    id: 'id-1',
    sykmeldingStatus: {
        statusEvent: StatusEvent.SENDT,
        arbeidsgiver: {
            orgnummer: '972674818',
            orgNavn: 'Hogwarts School of Witchcraft and Wizardry',
        },
    },
    behandlingsutfall: { status: RegelStatus.OK },
    sykmeldingsperioder: [
        {
            fom: dayjs().format('YYYY-MM-DD'),
            tom: dayjs().add(12, 'days').format('YYYY-MM-DD'),
        },
    ],
    syketilfelleStartDato: dayjs().format('YYYY-MM-DD'),
}

export const bekreftetSykmelding: DittSykefravaerSykmelding = {
    id: 'id-2',
    sykmeldingStatus: {
        statusEvent: StatusEvent.BEKREFTET,
    },
    behandlingsutfall: { status: RegelStatus.OK },
    sykmeldingsperioder: [{ fom: '2021-03-15', tom: '2021-03-19' }],
    syketilfelleStartDato: '2021-03-01',
}

export const avvistSykmelding: DittSykefravaerSykmelding = {
    id: 'id-3',
    sykmeldingStatus: { statusEvent: StatusEvent.APEN },
    behandlingsutfall: { status: RegelStatus.INVALID },
    sykmeldingsperioder: [{ fom: '2021-03-19', tom: '2021-03-19' }],
    syketilfelleStartDato: '2021-03-01',
}
