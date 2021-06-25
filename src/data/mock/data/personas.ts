import { avbrutt, avventendeUnderArbeid, nyUnderArbeid, utdatert } from './oppfolgingsplaner'
import { Persona } from './persona'
import { soknader } from './soknader'
import { vedtakMed100Grad } from './vedtak'


export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: { status: 'AVBRUTT' },
    dialogmoteBehov: { visMotebehov: false },
    sykmeldinger: [],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false }
}

export const enNySykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: { status: 'AVBRUTT' },
    dialogmoteBehov: { visMotebehov: false },
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
}

export const enAvvistSykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmote: { status: 'AVBRUTT' },
    dialogmoteBehov: { visMotebehov: false },
    sykmeldinger: [ {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
}

export const defaultPersona: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    oppfolgingsplaner: [ nyUnderArbeid, utdatert, avbrutt, avventendeUnderArbeid ],
    dialogmote: { status: 'BEKREFTET' },
    dialogmoteBehov: { visMotebehov: true },
    sykmeldinger: [ {
        id: 'SENDT',
        sykmeldingStatus: {
            statusEvent: 'SENDT',
            arbeidsgiver: { orgnummer: '972674818', orgNavn: 'Hogwarts School of Witchcraft and Wizardry' }
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
    }, {
        id: 'APEN',
        sykmeldingStatus: {
            'statusEvent': 'BEKREFTET',
            'sporsmalOgSvarListe': [
                {
                    'shortName': 'FORSIKRING',
                    'svar': {
                        'svarType': 'JA_NEI',
                        'svar': 'JA'
                    }
                },
                {
                    'shortName': 'FRAVAER',
                    'svar': {
                        'svarType': 'JA_NEI',
                        'svar': 'NEI'
                    }
                },
                {
                    'shortName': 'ARBEIDSSITUASJON',
                    'svar': {
                        'svarType': 'ARBEIDSSITUASJON',
                        'svar': 'FRILANSER'
                    }
                }
            ]
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-15', tom: '2021-03-19' } ],
    }, {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' },
        sykmeldingsperioder: [ { fom: '2021-03-19', tom: '2021-03-19' } ],
    } ],
    narmesteledere: [ {
        navn: 'Albus Dumbledore',
        orgnummer: '972674818',
        arbeidsgiverForskutterer: true,
    } ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true },
}
