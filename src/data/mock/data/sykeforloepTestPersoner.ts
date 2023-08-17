import dayjs from 'dayjs'

import { Persona } from './persona'
import { arbeidstaker100 } from './soknader'

const iDag = dayjs()

export const sykeforloepTestPerson = (): Persona => {
    return {
        meldinger: [],
        soknader: [arbeidstaker100],
        oppfolgingsplaner: [],
        vedtak: [],
        sykmeldinger: [
            {
                id: 'SENDT',
                sykmeldingStatus: {
                    arbeidsgiver: {
                        orgnummer: '972674818',
                        orgNavn: 'Sykmeldingsperioder AS',
                    },
                    statusEvent: 'SENDT',
                    sporsmalOgSvarListe: [
                        {
                            shortName: 'ARBEIDSSITUASJON',
                            svar: {
                                svarType: 'ARBEIDSSITUASJON',
                                svar: 'ARBEIDSTAKER',
                            },
                        },
                    ],
                },
                behandlingsutfall: { status: 'OK' },
                sykmeldingsperioder: [
                    {
                        fom: iDag.format('YYYY-MM-DD'),
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
        arbeidsrettetOppfolging: { erUnderOppfolging: false },
        dialogmoteBehov: {
            visMotebehov: false,
            skjemaType: null,
            motebehov: null,
        },
    }
}

export const snartSlutt = () => {
    const førtitoUker = iDag.subtract(293, 'days')
    const person = sykeforloepTestPerson()
    person.sykmeldinger[0].sykmeldingsperioder[0] = {
        fom: førtitoUker.format('YYYY-MM-DD'),
        tom: iDag.format('YYYY-MM-DD'),
    }
    person.meldinger = [
        {
            uuid: '123456y7',
            tekst: 'Snart slutt på sykepengene',
            variant: 'info',
            meldingType: 'ESYFOVARSEL_MER_VEILEDNING',
            lukkbar: true,
            lenke: 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene',
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ]
    person.arbeidsrettetOppfolging = { erUnderOppfolging: false }
    return person
}

export const forskuttererIkke = () => {
    const person = sykeforloepTestPerson()
    person.narmesteledere = [
        {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: false,
            aktivFom: iDag.add(10, 'days').format('YYYY-MM-DD'),
        },
    ]
    return person
}
