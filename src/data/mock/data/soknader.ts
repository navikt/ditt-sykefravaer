import { Soknad } from '../../../types/soknad'
import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'

export const arbeidstaker100: Soknad = {
    id: 'd9ac193d-9b67-4a51-80c2-fe4289214878',
    soknadstype: 'ARBEIDSTAKERE',
    status: 'NY',
    arbeidssituasjon: 'ARBEIDSTAKER',
    opprettetDato: '2023-05-06',
}

export const sendtSoknad: Soknad = jsonDeepCopy(arbeidstaker100)
sendtSoknad.id = 'faba11f5-c4f2-4647-8c8a-58b28ce2f388'
sendtSoknad.status = 'SENDT'

export const soknadUtland: Soknad = {
    id: 'faba11f5-c4f2-4647-8c8a-58b65ce2f3ef',
    soknadstype: 'OPPHOLD_UTLAND',
    status: 'NY',
    arbeidssituasjon: 'ARBEIDSTAKER',
    opprettetDato: '2023-05-06',
}
