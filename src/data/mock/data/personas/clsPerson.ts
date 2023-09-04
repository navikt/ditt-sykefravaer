import dayjs from 'dayjs'

import { Persona } from '../../testperson'
import { sendtSoknad } from '../soknader'
import { nySykmelding, sendtSykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

export const clsPerson: Persona = {
    ...commonPersona(),
    soknader: [sendtSoknad],
    sykmeldinger: [sendtSykmelding, nySykmelding],
    narmesteledere: [
        {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: dayjs().add(10, 'days').format('YYYY-MM-DD'),
        },
    ],
    beskrivelse: 'CLS',
}
