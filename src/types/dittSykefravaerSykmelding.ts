import { ArbeidsgiverStatus, RegelStatus, StatusEvent } from './sykmelding'

export interface DittSykefravaerSykmelding {
    id: string
    sykmeldingStatus: {
        statusEvent: StatusEvent
        arbeidsgiver?: ArbeidsgiverStatus | null
    }
    behandlingsutfall: {
        status: RegelStatus
    }
    sykmeldingsperioder: Periode[]
    syketilfelleStartDato?: string
}

export interface Periode {
    fom: string
    tom: string
}
