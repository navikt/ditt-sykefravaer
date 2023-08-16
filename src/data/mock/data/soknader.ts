import { Soknad } from '../../../types/soknad'
import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'

export const arbeidstaker100: Soknad = {
    id: 'faba11f5-c4f2-4647-8c8a-58b28ce2f3ef',
    soknadstype: 'ARBEIDSTAKERE',
    status: 'NY',
    arbeidssituasjon: 'ARBEIDSTAKER',
    opprettetDato: '2023-05-06',
}

export const sendtSoknad: Soknad = jsonDeepCopy(arbeidstaker100)
sendtSoknad.status = 'SENDT'
sendtSoknad.id = 'faba11f5-c4f2-4647-8c8a-58b28ce2f388'
export const soknader: Soknad[] = [arbeidstaker100]
