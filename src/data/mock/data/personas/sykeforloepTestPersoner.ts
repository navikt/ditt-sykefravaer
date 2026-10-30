import dayjs from 'dayjs'

import { Persona } from '../../testperson'
import { sendtSoknad } from '../soknader'
import { sendtSykmelding } from '../sykmeldinger'

import { ALBUS_DUMBLEDORE_LEDER_ID, commonPersona } from './personas'

const iDag = dayjs()
const førtitoUker = iDag.subtract(293, 'days')

export const snartSluttPerson: Persona = {
    ...commonPersona(),
    soknader: [sendtSoknad],
    sykmeldinger: [
        {
            ...sendtSykmelding,
            sykmeldingsperioder: [
                {
                    fom: førtitoUker.format('YYYY-MM-DD'),
                    tom: iDag.format('YYYY-MM-DD'),
                },
            ],
        },
    ],
    narmesteledere: [
        {
            id: ALBUS_DUMBLEDORE_LEDER_ID,
            orgNumber: '972674818',
            activeFrom: iDag.add(10, 'days').format('YYYY-MM-DD'),
            name: {
                firstName: 'Albus',
                middleName: null,
                lastName: 'Dumbledore',
            },
            emailAddresses: ['albus@fake.nav.no'],
            mobile: '99999999',
        },
    ],
    meldinger: [
        {
            uuid: '123456y7',
            tekst: 'Snart slutt på sykepengene',
            variant: 'info',
            meldingType: 'ESYFOVARSEL_MER_VEILEDNING',
            lukkbar: true,
            lenke: 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene',
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ],
    beskrivelse: 'Person med melding om snart slutt på sykepengene',
}
