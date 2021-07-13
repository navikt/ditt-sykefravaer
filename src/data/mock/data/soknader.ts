import { Soknad } from '../../../types/soknad'

export const arbeidstaker100: Soknad = {
    'id': 'faba11f5-c4f2-4647-8c8a-58b28ce2f3ef',
    'soknadstype': 'ARBEIDSTAKERE',
    'status': 'NY',
    'arbeidssituasjon': 'ARBEIDSTAKER',
}

export const arbeidstaker100Sendt: Soknad = {
    ...arbeidstaker100,
    status: 'SENDT'
}

export const soknader: Soknad[] = [ arbeidstaker100 ]
