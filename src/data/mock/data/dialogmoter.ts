import { DialogMote } from '../../../types/dialogmote'

export const enTomDialogmote: DialogMote = {
    'status': 'AVBRUTT',
    'alternativer': [],
    'deltakere': [],
    'bekreftetAlternativ': {
        'id': 0,
        'tid': '',
        'created': '',
        'sted': '',
        'valgt': false
    },
    'bekreftetTidspunkt': '',
    'opprettetTidspunkt': ''
}

export const dialogmoteSkjema: DialogMote = {
    'status': 'SKJEMA',
    'alternativer': [
        {
            'id': 1,
            'tid': '10-01-2030',
            'created': '01-01-2021',
            'sted': 'Hos mange',
            'valgt': false
        }
    ],
    'deltakere': [
        {
            'navn': 'Ingen Ingensen',
            'fnr': '13098023954',
            'orgnummer': '972674818',
            'epost': 'ingen.ingensen@hotmail.com',
            'type': 'Arbeidsgiver',
            'svartidspunkt': '01-01-2021',
            'svar': [
                {
                    'id': 1,
                    'tid': '10-01-2021',
                    'created': '01-01-2021',
                    'sted': 'Hos mange',
                    'valgt': false
                }
            ]
        },
        {
            'navn': 'stor kar',
            'fnr': '13098023954',
            'orgnummer': '972674818',
            'epost': 'stor.kar@hotmail.com',
            'type': 'Bruker',
            'svartidspunkt': '02-01-2021',
            'svar': [
                {
                    'id': 1,
                    'tid': '',
                    'created': '',
                    'sted': '',
                    'valgt': false
                }
            ]
        }
    ],
    'bekreftetAlternativ': {
        'id': 1,
        'tid': '09-01-2030',
        'created': '08-01-2021',
        'sted': 'Hos mange',
        'valgt': false
    },
    'bekreftetTidspunkt': '10-01-2021',
    'opprettetTidspunkt': '10-01-2021',
}

