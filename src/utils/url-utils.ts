import { RSVedtakWrapper } from '../types/rs-types/rs-vedtak'

export const getUrlTilVedtak = (vedtak: RSVedtakWrapper) => {
    return `/vedtak/${vedtak.id}`
}

export const oversiktside = '/'
