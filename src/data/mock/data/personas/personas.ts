import { Persona } from '../../testperson'
import { nyttVedtakMed100Grad, vedtakMed100Grad } from '../vedtak'
import { avvistSykmelding, bekreftetSykmelding, sendtSykmelding } from '../sykmeldinger'
import { arbeidstaker100 } from '../soknader'
import { StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { altinnInntektsmelding, altinnInntektsmelding2 } from './inntektsmeldingTestData'

export const ALBUS_DUMBLEDORE_LEDER_ID = '00000000-0000-4000-8000-000000000001'
export const SEVERUS_SNAPE_LEDER_ID = '00000000-0000-4000-8000-000000000002'
export const CHARITY_BURBAGE_LEDER_ID = '00000000-0000-4000-8000-000000000003'

type PersonaUtenBeskrivelse = Omit<Persona, 'beskrivelse'>
export const commonPersona = (): PersonaUtenBeskrivelse => {
    return {
        soknader: [],
        vedtak: [],
        sykmeldinger: [],
        narmesteledere: [],
        maxdato: { maxDate: null, utbetaltTom: null },
        arbeidsrettetOppfolging: { erUnderOppfolging: false },
        meldinger: [],
    }
}

export const defaultPersona: Persona = {
    soknader: [arbeidstaker100],
    meldinger: [],
    vedtak: [vedtakMed100Grad, nyttVedtakMed100Grad],
    inntektsmeldinger: [altinnInntektsmelding, altinnInntektsmelding2],
    sykmeldinger: [
        sendtSykmelding,
        {
            ...sendtSykmelding,
            sykmeldingStatus: {
                statusEvent: StatusEvent.SENDT,
                arbeidsgiver: {
                    orgnummer: '972674819',
                    orgNavn: 'Diagon Alley',
                },
            },
        },
        {
            ...sendtSykmelding,
            sykmeldingStatus: {
                statusEvent: StatusEvent.SENDT,
                arbeidsgiver: {
                    orgnummer: '972674820',
                    orgNavn: 'Gloucester Cathedral',
                },
            },
        },
        bekreftetSykmelding,
        avvistSykmelding,
    ],
    narmesteledere: [
        {
            id: ALBUS_DUMBLEDORE_LEDER_ID,
            orgNumber: '972674818',
            activeFrom: '2021-03-19',
            name: {
                firstName: 'Albus',
                middleName: null,
                lastName: 'Dumbledore',
            },
            emailAddresses: ['albus@fake.nav.no'],
            mobile: '99999999',
        },
        {
            id: SEVERUS_SNAPE_LEDER_ID,
            orgNumber: '972674819',
            activeFrom: '2021-03-19',
            name: {
                firstName: 'Severus',
                middleName: null,
                lastName: 'Snape',
            },
            emailAddresses: ['severus@fake.nav.no'],
            mobile: '99999998',
        },
        {
            id: CHARITY_BURBAGE_LEDER_ID,
            orgNumber: '972674820',
            activeFrom: '2021-03-20',
            name: {
                firstName: 'Charity',
                middleName: null,
                lastName: 'Burbage',
            },
            emailAddresses: ['charity@fake.nav.no'],
            mobile: '99999997',
        },
    ],
    maxdato: { maxDate: '2025-01-02', utbetaltTom: '2023-01-02' },
    arbeidsrettetOppfolging: { erUnderOppfolging: true },
    beskrivelse: 'Person med det meste',
}
