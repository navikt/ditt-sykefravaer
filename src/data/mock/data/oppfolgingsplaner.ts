import { Oppfolgingsplan } from '../../../types/oppfolgingsplan'

export const avbrutt: Oppfolgingsplan = {
    'id': 4182,
    'status': 'AVBRUTT',
    'virksomhet': { 'virksomhetsnummer': '972674818' },
    'godkjenninger': [],
    'arbeidstaker': {
        'fnr': '18048600146',
        'sistInnlogget': '2021-05-31T12:12:08.038038',

    },
    'sistEndretAv': {
        'fnr': '13098023954',
    }
}

export const utdatert: Oppfolgingsplan = {
    'id': 4183,
    'status': 'UTDATERT',
    'virksomhet': { 'virksomhetsnummer': '972674818' },
    'godkjenninger': [],
    'arbeidstaker': {
        'fnr': '18048600146',
        'sistInnlogget': '2021-05-31T12:12:08.038038',

    },
    'sistEndretAv': {
        'fnr': '13098023954',
    }
}

export const nyUnderArbeid: Oppfolgingsplan = {
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
}


export const avventendeUnderArbeid: Oppfolgingsplan = {
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
}
