import { Persona } from '../../testperson'

import { commonPersona } from './personas'

export const heltFriskPerson: Persona = {
    ...commonPersona(),
    beskrivelse: 'Person som er helt frisk',
}
