import dayjs from 'dayjs'

import { Persona } from '../../testperson'
import { sendtSoknad } from '../soknader'
import { sendtSykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

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
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: iDag.add(10, 'days').format('YYYY-MM-DD'),
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

export const forskuttererIkkePerson: Persona = {
    ...commonPersona(),
    soknader: [sendtSoknad],
    sykmeldinger: [sendtSykmelding],
    narmesteledere: [
        {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: false,
            aktivFom: iDag.add(10, 'days').format('YYYY-MM-DD'),
        },
    ],
    beskrivelse: 'Arbeidsgiver forkutterer ikke',
}
