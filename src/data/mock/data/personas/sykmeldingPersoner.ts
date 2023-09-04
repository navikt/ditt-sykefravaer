import { Persona } from '../../testperson'
import { avvistSykmelding, nySykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

export const enAvvistSykmeldingPerson: Persona = {
    ...commonPersona(),
    sykmeldinger: [avvistSykmelding],
    beskrivelse: 'En avvist sykmelding',
}

export const enNySykmelding: Persona = {
    ...commonPersona(),
    sykmeldinger: [nySykmelding],
    beskrivelse: 'En ny sykmelding',
}
