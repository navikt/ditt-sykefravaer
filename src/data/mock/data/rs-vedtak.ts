import { RSVedtakWrapper } from '../../../types/rs-types/rs-vedtak'

export const vedtakMed100Grad: RSVedtakWrapper = {
    id: 'dff11217-31ea-404a-86ab-b521a6a946af',
    lest: true,
    lestDato: '1970-01-01T01:00:00+01:00',
    opprettet: '2021-05-06',
    annullert: false
}

export const ulestVedtakUtenUtbetalingsdager: RSVedtakWrapper = {
    id: '99f389f2-0084-481b-bed8-47f6ac3491d4',
    lest: false,
    lestDato: undefined,
    opprettet: '2021-05-03',
    annullert: false
}

export const vedtakAnnullert: RSVedtakWrapper = {
    id: '9ae82dd2-dcf1-4c16-9e12-35cb6d634337',
    lest: true,
    lestDato: '2021-05-05T11:50:56.812287Z',

    opprettet: '2021-05-05',
    annullert: true
}

export const nyeVedtak: RSVedtakWrapper[] = [
    vedtakMed100Grad,
    ulestVedtakUtenUtbetalingsdager,
    vedtakAnnullert
]
