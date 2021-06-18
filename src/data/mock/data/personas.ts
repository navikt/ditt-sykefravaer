import { ArbeidsrettetOppfolging } from '../../../types/arbeidsrettetOppfolging'
import { NarmesteLeder } from '../../../types/narmesteLeder'
import { RSSoknad } from '../../../types/rs-types/rs-soknad'
import { RSVedtakWrapper } from '../../../types/rs-types/rs-vedtak'
import { Sykmelding } from '../../../types/sykmelding'
import { soknader } from './soknader'
import { vedtakMed100Grad } from './vedtak'

export interface Persona {
    soknader: RSSoknad[],
    vedtak: RSVedtakWrapper[],
    sykmeldinger: Sykmelding[],
    narmesteledere: NarmesteLeder[],
    snartSluttSykepenger: boolean,
    arbeidsrettetOppfolging: ArbeidsrettetOppfolging,
}


export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    sykmeldinger: [],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false }
}

export const enNySykmelding: Persona = {
    soknader: [],
    vedtak: [],
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
        organisasjonsnavn: 'Hogwarts School of Witchcraft and Wizardry',
        arbeidsgiverForskuttererLoenn: true,
    } ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true },
}
