import dayjs from 'dayjs'

import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'
import { enTomDialogmote } from './dialogmoter'
import { Persona } from './persona'

const commonPersona: Persona = {
    soknader: [],
    oppfolgingsplaner: [],
    vedtak: [],
    sykmeldinger: [ {
        id: 'SENDT',
        sykmeldingStatus: {
            arbeidsgiver: {
                orgnummer: '972674818',
                orgNavn: 'navnet'
            },
            'statusEvent': 'BEKREFTET',
            'sporsmalOgSvarListe': []
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ {
            fom: dayjs().subtract(4, 'months').format('YYYY-MM-DD'),
            tom: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
        } ],
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
    dialogmote: enTomDialogmote,
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykeforloep: [],
    hendelser: [],
    brev: [],
}

export const enNyOppfolgingsplan = () => {
    const ret = jsonDeepCopy(commonPersona)
    ret.oppfolgingsplaner = [ {
        'id': 4183,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    } ]
    return ret
}


export const toNyeOppfolgingsplaner = () => {
    const ret = jsonDeepCopy(commonPersona)
    ret.oppfolgingsplaner = [ {
        'id': 4183,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    }, {
        'id': 4184,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    } ]
    return ret
}


export const enNyTilGodkjenning = () => {
    const ret = jsonDeepCopy(commonPersona)
    ret.oppfolgingsplaner = [ {
        'id': 4183,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [
            {
                godkjenningsTidspunkt: '2021-05-31T12:12:08.038038',
                godkjent: true,
                godkjentAv: {
                    fnr: '13098023954'
                }
            }
        ],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    } ]
    return ret
}


export const toTilGodkjenning = () => {
    const ret = jsonDeepCopy(commonPersona)
    ret.oppfolgingsplaner = [ {
        'id': 4183,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [
            {
                godkjenningsTidspunkt: '2021-05-31T12:12:08.038038',
                godkjent: true,
                godkjentAv: {
                    fnr: '13098023954'
                }
            }
        ],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    }, {
        'id': 4184,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [
            {
                godkjenningsTidspunkt: '2021-05-31T12:12:08.038038',
                godkjent: true,
                godkjentAv: {
                    fnr: '13098023954'
                }
            }
        ],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    } ]
    return ret
}
