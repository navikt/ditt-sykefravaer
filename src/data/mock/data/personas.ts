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
        behandlingsutfall: { status: 'OK' }
    } ],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false }

}

export const enAvvistSykmelding: Persona = {
    soknader: [],
    vedtak: [],
    sykmeldinger: [ {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' }
    } ],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false }

}

export const defaultPersona: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' }
    }, {
        id: 'AVVIST',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' }
    } ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { underOppfolging: true }

}
