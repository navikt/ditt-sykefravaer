import dayjs from 'dayjs'

import { NarmesteLeder } from './narmesteLeder'

export type HendelseType = 'AKTIVITETSKRAV_VARSEL' | 'AKTIVITETSKRAV_BEKREFTET' | 'NY_NAERMESTE_LEDER' | 'BOBLE' | 'FØRSTE_SYKMELDINGSDAG' | 'TITTEL' | 'TID'

export interface Hendelse {
    antallDager?: number
    type: HendelseType
    tekstkey: string
    inntruffetdato?: dayjs.Dayjs
    data?: {
        naermesteLeder: NarmesteLeder
    }
}
