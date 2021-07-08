import { NarmesteLeder } from './narmesteLeder'

export type HendelseType = 'AKTIVITETSKRAV_VARSEL' | 'AKTIVITETSKRAV_BEKREFTET' | 'NY_NAERMESTE_LEDER' | 'BOBLE' | 'FØRSTE_SYKMELDINGSDAG' | 'TITTEL' | 'TID'

// TODO: Finn ut hvilke data som trengs
export interface SimpleHendelse {
    inntruffetdato?: string,
    type: HendelseType,
}

export interface Hendelse extends SimpleHendelse {
    antallDager?: number
    tekstkey: string
    data?: {
        naermesteLeder: NarmesteLeder
    }
}
