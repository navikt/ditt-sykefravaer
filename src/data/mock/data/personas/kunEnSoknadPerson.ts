import { sendtSykmelding } from '../sykmeldinger'
import { tekst } from '../../../../utils/tekster'
import { Persona } from '../../testperson'
import { StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { commonPersona } from './personas'

export const kunEnSoknadPerson: Persona = {
    ...commonPersona(),
    sykmeldinger: [
        {
            ...sendtSykmelding,
            sykmeldingStatus: {
                statusEvent: StatusEvent.SENDT,
                arbeidsgiver: {
                    orgnummer: '972674818',
                    orgNavn: 'MATBUTIKKEN AS',
                },
            },
        },
    ],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: tekst('oppgaver.sykepengesoknad.enkel'),
            lenke: 'https://sykepengesoknad.labs.nais.io/syk/sykepengesoknad/soknader/963e816f-7b3c-4513-818b-95595d84dd91/1?testperson=brukertest',
            variant: 'info',
            meldingType: 'ny søknad',
            lukkbar: false,
        },
    ],
    beskrivelse: 'Oppgave med ny søknad som kan sendes inn',
}
