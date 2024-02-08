import { RSVedtakWrapper } from '../../../types/vedtak'

export const vedtakMed100Grad: RSVedtakWrapper = {
    id: 'dff11217-31ea-404a-86ab-b521a6a946af',
    lest: true,
    lestDato: '1970-01-01T01:00:00+01:00',
    opprettet: '2021-05-06',
    annullert: false,
    vedtak: {
        utbetaling: {
            forbrukteSykedager: 14,
            gjenståendeSykedager: 36,
        },
    },
}

export const nyttVedtakMed100Grad: RSVedtakWrapper = {
    id: 'dff11217-31ea-404a-86ab-b521a6a946af',
    lest: true,
    lestDato: '1970-01-01T01:00:00+01:00',
    opprettet: '2023-06-20',
    annullert: false,
    vedtak: {
        utbetaling: {
            forbrukteSykedager: 50,
            gjenståendeSykedager: 55,
        },
    },
}
