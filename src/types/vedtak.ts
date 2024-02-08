export interface RSVedtakWrapper {
    id: string
    lest: boolean
    lestDato?: string
    opprettet: string
    annullert: boolean
    vedtak: RSVedtak
}

interface RSVedtak {
    utbetaling: RSUtbetalingUtbetalt
}

interface RSUtbetalingUtbetalt {
    forbrukteSykedager: number
    gjenståendeSykedager: number
}
