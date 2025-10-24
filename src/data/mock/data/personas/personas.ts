import { Persona } from '../../testperson'
import { nyttVedtakMed100Grad, vedtakMed100Grad } from '../vedtak'
import { avvistSykmelding, bekreftetSykmelding, sendtSykmelding } from '../sykmeldinger'
import { arbeidstaker100 } from '../soknader'
import { avbrutt, avventendeUnderArbeid, nyUnderArbeid, utdatert } from '../oppfolgingsplaner'
import { StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { altinnInntektsmelding, altinnInntektsmelding2 } from './inntektsmeldingTestData'

type PersonaUtenBeskrivelse = Omit<Persona, 'beskrivelse'>
export const commonPersona = (): PersonaUtenBeskrivelse => {
    return {
        soknader: [],
        vedtak: [],
        sykmeldinger: [],
        narmesteledere: [],
        maxdato: { maxDate: null, utbetaltTom: null },
        arbeidsrettetOppfolging: { erUnderOppfolging: false },
        oppfolgingsplaner: [],
        meldinger: [],
    }
}

export const defaultPersona: Persona = {
    soknader: [arbeidstaker100],
    meldinger: [],
    vedtak: [vedtakMed100Grad, nyttVedtakMed100Grad],
    oppfolgingsplaner: [nyUnderArbeid, utdatert, avbrutt, avventendeUnderArbeid],
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
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: '2021-03-19',
        },
        {
            navn: 'Severus Snape',
            orgnummer: '972674819',
            arbeidsgiverForskutterer: true,
            aktivFom: '2021-03-19',
        },
        {
            navn: 'Charity Burbage',
            orgnummer: '972674820',
            arbeidsgiverForskutterer: true,
            aktivFom: '2021-03-20',
        },
    ],
    maxdato: { maxDate: '2025-01-02', utbetaltTom: '2023-01-02' },
    arbeidsrettetOppfolging: { erUnderOppfolging: true },
    beskrivelse: 'Person med det meste',
}
