import { logger } from '@navikt/next-logger'
import { v4 as uuidv4 } from 'uuid'

export type FetchResult = { requestId: string; response: Response }

export async function fetchMedRequestId(url: string, optionsInn?: RequestInit): Promise<FetchResult> {
    const requestId = uuidv4()

    const options: RequestInit = optionsInn ? optionsInn : {}
    options.headers = options.headers
        ? { ...options.headers, 'x-request-id': requestId }
        : { 'x-request-id': requestId }
    options.cache = 'no-store'

    const fetchUrl = async () => {
        try {
            return await fetch(url, options)
        } catch (e) {
            logger.warn(
                e,
                `${e} - Kall til url: ${
                    options.method || 'GET'
                } ${url} og x_request_id: ${requestId} feilet uten svar fra backend.`,
            )
            throw e
        }
    }

    const response = await fetchUrl()

    if (response.status == 401) {
        window.location.reload()
        throw new Error('Laster siden på nytt på grunn av HTTP-kode 401 fra backend.')
    }

    if (!response.ok) {
        if (!(response.status === 403 && url.endsWith('/veilarboppfolging/api/v2/oppfolging'))) {
            const feilmelding = `Kall til url: ${
                options.method || 'GET'
            } ${url} og x_request_id: ${requestId} feilet med HTTP-kode: ${response.status}.`
            // Må både logge og kaste exception siden feilen ikke blir logget av react-query.
            logger.warn(feilmelding)
            throw new Error(feilmelding)
        }
    }

    return { requestId, response }
}

export async function fetchJson(url: string, options: RequestInit = {}) {
    const fetchResult = await fetchMedRequestId(url, options)
    const response = fetchResult.response

    try {
        return await response.json()
    } catch (e) {
        logger.warn(
            e,
            `${e} - Kall til url: ${options.method || 'GET'} ${url} og x_request_id: ${
                fetchResult.requestId
            } feilet ved parsing av JSON med HTTP-kode: ${response.status}.`,
        )
        throw e
    }
}
