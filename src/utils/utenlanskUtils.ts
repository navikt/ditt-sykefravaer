import { Sykmelding } from '../types/sykmelding/sykmelding'

export type UtenlandskSykmelding = Omit<Sykmelding, 'utenlandskSykmelding'> & {
    readonly utenlandskSykmelding: NonNullable<Sykmelding['utenlandskSykmelding']>
}

export function isUtenlandsk(sykmelding: Sykmelding): sykmelding is UtenlandskSykmelding {
    return sykmelding.utenlandskSykmelding != null
}
