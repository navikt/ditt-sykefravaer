import dayjs from 'dayjs'

import { enTomDialogmote } from './dialogmoter'
import { Persona } from './persona'
import { arbeidstaker100 } from './soknader'

const iDag = dayjs()

const commonPersona = (): Persona => {
    return {
        soknader: [ arbeidstaker100 ],
        oppfolgingsplaner: [],
        vedtak: [],
        sykmeldinger: [ {
            id: 'SENDT',
            sykmeldingStatus: {
                arbeidsgiver: {
                    orgnummer: '972674818',
                    orgNavn: 'Sykmeldingsperioder AS'
                },
                statusEvent: 'SENDT',
                sporsmalOgSvarListe: [ {
                    shortName: 'ARBEIDSSITUASJON',
                    svar: { svarType: 'ARBEIDSSITUASJON', svar: 'ARBEIDSTAKER', }
                } ]
            },
            behandlingsutfall: { status: 'OK' },
            sykmeldingsperioder: [ {
                fom: iDag.format('YYYY-MM-DD'),
                tom: iDag.format('YYYY-MM-DD'),
            } ],
        } ],
        narmesteledere: [ {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: iDag.add(10, 'days').format('YYYY-MM-DD'),
        } ],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
        sykeforloep: [],
        hendelser: [],
    }
}

export const langtidssykmeldt = () => {
    const tjuesjuUker = iDag.subtract(188, 'days')
    const person = commonPersona()
    person.sykmeldinger[0].sykmeldingsperioder[0] = {
        fom: tjuesjuUker.format('YYYY-MM-DD'),
        tom: iDag.format('YYYY-MM-DD'),
    }
    person.sykeforloep = [ {
        oppfolgingsdato: person.sykmeldinger[0].sykmeldingsperioder[0].fom,
        sykmeldinger: [ {
            fom: person.sykmeldinger[0].sykmeldingsperioder[0].fom,
            tom: person.sykmeldinger[0].sykmeldingsperioder[0].tom,
        } ]
    } ]
    return person
}

export const snartSlutt = () => {
    const førtitoUker = iDag.subtract(293, 'days')
    const person = commonPersona()
    person.sykmeldinger[0].sykmeldingsperioder[0] = {
        fom: førtitoUker.format('YYYY-MM-DD'),
        tom: iDag.format('YYYY-MM-DD'),
    }
    person.sykeforloep = [ {
        oppfolgingsdato: person.sykmeldinger[0].sykmeldingsperioder[0].fom,
        sykmeldinger: [ {
            fom: person.sykmeldinger[0].sykmeldingsperioder[0].fom,
            tom: person.sykmeldinger[0].sykmeldingsperioder[0].tom,
        } ]
    } ]
    person.snartSluttSykepenger = true
    return person
}

export const tvingMindreEnnTrettiniUker = () => {
    const person = snartSlutt()

    person.sykmeldinger.push({
        ...commonPersona().sykmeldinger[0],
        ...{
            sykmeldingStatus: {
                statusEvent: 'APEN'
            },
            sykmeldingsperioder: [ {
                fom: iDag.format('YYYY-MM-DD'),
                tom: iDag.format('YYYY-MM-DD'),
            } ],
        }
    })
    person.sykeforloep[0].sykmeldinger.push({
        fom: iDag.format('YYYY-MM-DD'),
        tom: iDag.format('YYYY-MM-DD'),
    })
    return person
}
