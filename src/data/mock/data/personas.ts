import { RSSoknad } from '../../../types/rs-types/rs-soknad'
import { RSVedtakWrapper } from '../../../types/rs-types/rs-vedtak'
import { Sykmelding } from '../../../types/sykmelding'
import { soknader } from './soknader'
import { vedtakMed100Grad } from './vedtak'

export interface Persona {
    soknader: RSSoknad[],
    vedtak: RSVedtakWrapper[],
    sykmeldinger: Sykmelding[],
}


export const heltFrisk: Persona = {
    soknader: [],
    vedtak: [],
    sykmeldinger: []
}

export const enNySykmelding: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' }
    } ]
}

export const enAvvistSykmelding: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' }
    } ]
}

export const defaultPersona: Persona = {
    soknader: soknader,
    vedtak: [ vedtakMed100Grad ],
    sykmeldinger: [ {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'OK' }
    }, {
        id: 'APEN',
        sykmeldingStatus: { statusEvent: 'APEN' },
        behandlingsutfall: { status: 'INVALID' }
    } ]
}
