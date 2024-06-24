import { sendtSykmelding } from '../sykmeldinger'
import { Persona } from '../../testperson'
import { arbeidstaker100 } from '../soknader'

import { commonPersona } from './personas'

export const flereSoknaderPerson: Persona = {
    ...commonPersona(),
    sykmeldinger: [
        {
            ...sendtSykmelding,
            sykmeldingStatus: {
                statusEvent: 'SENDT',
                arbeidsgiver: {
                    orgnummer: '972674818',
                    orgNavn: 'MATBUTIKKEN AS',
                },
            },
        },
    ],
    soknader: [arbeidstaker100, arbeidstaker100],
    beskrivelse: 'Flere søknader som kan sendes inn',
}
