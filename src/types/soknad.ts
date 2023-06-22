import { ArbeidssituasjonType } from './arbeidssituasjon'
import { Soknadstatus } from './soknadstatus'
import { Soknadstype } from './soknadstype'

export interface Soknad {
    id: string
    soknadstype: Soknadstype
    status: Soknadstatus
    arbeidssituasjon: ArbeidssituasjonType | null
    opprettetDato: string | null
}
