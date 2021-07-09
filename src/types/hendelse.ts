import { NarmesteLeder } from './narmesteLeder'

export type HendelseType = 'AKTIVITETSKRAV_VARSEL' | 'AKTIVITETSKRAV_BEKREFTET' | 'NY_NAERMESTE_LEDER' | 'BOBLE' | 'FØRSTE_SYKMELDINGSDAG' | 'TITTEL' | 'TID'

export interface SimpleHendelse {
    type: HendelseType,
    inntruffetdato?: string,
}

export interface Hendelse extends SimpleHendelse {
    antallDager?: number
    tekstkey: string
    data?: {
        naermesteLeder: NarmesteLeder
    }
}
