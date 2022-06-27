import dayjs from 'dayjs'

import { Persona } from './persona'
import { arbeidstaker100 } from './soknader'

const iDag = dayjs()

const commonPersona = (): Persona => {
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
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        dialogmoteBehov: {
            visMotebehov: false,
            skjemaType: null,
            motebehov: null,
        },
        brev: [],
    }
}

export const snartSlutt = () => {
    const førtitoUker = iDag.subtract(293, 'days')
    const person = commonPersona()
    person.sykmeldinger[0].sykmeldingsperioder[0] = {
        fom: førtitoUker.format('YYYY-MM-DD'),
        tom: iDag.format('YYYY-MM-DD'),
    }

    person.arbeidsrettetOppfolging = { underOppfolging: false }
    person.snartSluttSykepenger = true
    return person
}
