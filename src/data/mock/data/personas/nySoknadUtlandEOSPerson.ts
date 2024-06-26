import { sendtSykmelding } from '../sykmeldinger'
import { Persona } from '../../testperson'
import { soknadUtland } from '../soknader'

import { commonPersona } from './personas'

export const nySoknadUtlandEOSPerson: Persona = {
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
    soknader: [soknadUtland],
    beskrivelse: 'Ny søknad om å beholde sykepengene for reise utenfor EU/EØS',
}
