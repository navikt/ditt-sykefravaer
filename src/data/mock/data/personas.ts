import { ArbeidsrettetOppfolging } from '../../../types/arbeidsrettetOppfolging'
import { RSSoknad } from '../../../types/rs-types/rs-soknad'
import { RSVedtakWrapper } from '../../../types/rs-types/rs-vedtak'
import { Sykmelding } from '../../../types/sykmelding'
import { soknader } from './soknader'
import { vedtakMed100Grad } from './vedtak'

export interface Persona {
    soknader: RSSoknad[],
    vedtak: RSVedtakWrapper[],
    sykmeldinger: Sykmelding[],
    snartSluttSykepenger: boolean,
    arbeidsrettetOppfolging: ArbeidsrettetOppfolging,
}


export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    sykmeldinger: [],
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
            arbeidsgiver: { orgnummer: '972674818', orgNavn: 'PENGELØS SPAREBANK' }
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-01', tom: '2021-03-12' } ],
    }, {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ { fom: '2021-03-15', tom: '2021-03-19' } ],
    }, {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' },
        sykmeldingsperioder: [ { fom: '2021-03-19', tom: '2021-03-19' } ],
    } ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true },
}
