import { logger } from '@navikt/next-logger'
import { v4 as uuidv4 } from 'uuid'

/**
 * Class with utility functions for working with fetch.
 * Redirects to Login Service if any request contains a 401 response.
 */
class Fetch {
    /**
     * Make a POST request to the specified endpoint
     * Redirects to Login Service if request contains a 401 response.
     * @param {string} url - The endpoint to call
     * @param {T | undefined} body - The body to send with the request
     * @return {string} The response from the http request parsed as text
     */
    static async authenticatedPost<T>(url: string, body?: T): Promise<string> {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const textResponse = await res.text()
        if (res.ok) {
            return textResponse
        }
        if (res.status === 401) {
            window.location.href = '/syk/sykefravaer' //Lar SSR authen fikse alt
            throw new Error('Sesjonen er utløpt. Vi videresender deg til innloggingssiden.')
        }
        logger.warn(`Request to ${url} resulted in statuscode: ${res.status} with message: ${textResponse}`)
        if (res.status === 400) {
            throw new Error(textResponse)
        }
        throw new Error('Vi har problemer med baksystemene for øyeblikket. Vennligst prøv igjen senere.')
    }
}

async function fetchMedRequestId(url: string, optionsInn?: RequestInit, skipRequestId?: boolean) {
    const uuid = uuidv4()

    const options: RequestInit = optionsInn ? optionsInn : {}
    if (!skipRequestId) {
        options.headers = options.headers ? { ...options.headers, 'x-request-id': uuid } : { 'x-request-id': uuid }
    }
    options.cache = 'no-store'

    try {
        // fetch() kaster exception for nettverksfeil, men ikke HTTP-statuskoder.
        const res = await fetch(url, options)
        return {
            res,
            x_request_id: uuid,
        }
    } catch (e: any) {
        // Logger x_request_id i stedet for x-request-id for å matche logging fra
        // ingress-controller og sykepengesoknad-backend.
        logger.warn(`${e.message} Kall til url: ${url} med x_request_id: ${uuid} feilet ved fetch kall.`)
        throw e
    }
}

export async function fetchJson(url: string, options?: RequestInit, skipRequestId?: boolean) {
    const fetchMedRequestSvar = await fetchMedRequestId(url, options, skipRequestId)

    if (fetchMedRequestSvar.res.status === 401) {
        window.location.href = '/syk/sykefravaer' //Lar SSR authen fikse alt
        throw new Error('Sesjonen utløpt.')
    }

    if (!fetchMedRequestSvar.res.ok) {
        if (!(fetchMedRequestSvar.res.status === 403 && url.endsWith('/veilarboppfolging/api/v2/oppfolging'))) {
            logger.error(
                `Kall til url: ${url} med x_request_id: ${fetchMedRequestSvar.x_request_id} fikk status ` +
                    fetchMedRequestSvar.res.status
            )
            throw new Error('Feil ved henting av ' + url)
        }
    }
    try {
        return await fetchMedRequestSvar.res.json()
    } catch (e: any) {
        logger.warn(
            `${e.message}, Kall til url: ${url} med x_request_id: ${fetchMedRequestSvar.x_request_id} feilet ved json() kall. Status: ${fetchMedRequestSvar.res.status}`
        )
        throw e
    }
}

export default Fetch
