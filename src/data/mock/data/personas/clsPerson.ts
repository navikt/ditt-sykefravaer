import dayjs from 'dayjs'

import { Persona } from '../../testperson'
import { sendtSoknad } from '../soknader'
import { nySykmelding, sendtSykmelding } from '../sykmeldinger'

import { ALBUS_DUMBLEDORE_LEDER_ID, commonPersona } from './personas'

export const clsPerson: Persona = {
    ...commonPersona(),
    soknader: [sendtSoknad],
    sykmeldinger: [sendtSykmelding, nySykmelding],
    narmesteledere: [
        {
            id: ALBUS_DUMBLEDORE_LEDER_ID,
            orgNumber: '972674818',
            activeFrom: dayjs().add(10, 'days').format('YYYY-MM-DD'),
            name: {
                firstName: 'Albus',
                middleName: null,
                lastName: 'Dumbledore',
            },
            emailAddresses: ['albus@fake.nav.no'],
            mobile: '99999999',
        },
    ],
    beskrivelse: 'CLS',
}
