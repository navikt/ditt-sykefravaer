import { differenceInDays, isAfter, isBefore, parseISO } from 'date-fns'

import { RegelStatus, StatusEvent, Sykmelding } from '../types/sykmelding/sykmelding'

import { toDate, toReadableDatePeriod } from './dateUtils'
import { isUtenlandsk } from './utenlanskUtils'

export function isActiveSykmelding(sykmelding: Sykmelding, dagensDato: Date = new Date()): boolean {
    // Alt som ikke er APEN status, er inaktive
    if (sykmelding.sykmeldingStatus.statusEvent !== 'APEN') return false
    // APEN sykmeldinger blir inaktive etter 12 måneder
    return differenceInDays(dagensDato, parseISO(sykmelding.mottattTidspunkt)) < 365
}

export function isUnderbehandling(sykmelding: Sykmelding): boolean {
    return (
        sykmelding.sykmeldingStatus.statusEvent === StatusEvent.SENDT &&
        sykmelding.merknader?.find((it) => it.type === 'UNDER_BEHANDLING') != null
    )
}

export function isSendtSykmelding(sykmelding: Sykmelding): boolean {
    const isNormalSendt = sykmelding.sykmeldingStatus.statusEvent === StatusEvent.SENDT
    const isBekreftetSendt =
        sykmelding.sykmeldingStatus.statusEvent === StatusEvent.BEKREFTET &&
        sykmelding.behandlingsutfall.status === RegelStatus.OK

    return isNormalSendt || isBekreftetSendt
}

/**
 * Get the type of sykmelding
 * Used for displaying the title.
 * @return {string}
 */
export function getSykmeldingTitle(
    sykmelding: Sykmelding | undefined,
): 'Sykmelding' | 'Papirsykmelding' | 'Egenmelding' | 'Utenlandsk sykmelding' {
    if (sykmelding && isUtenlandsk(sykmelding)) {
        return 'Utenlandsk sykmelding'
    } else if (sykmelding?.papirsykmelding) {
        return 'Papirsykmelding'
    } else if (sykmelding?.egenmeldt) {
        return 'Egenmelding'
    }
    return 'Sykmelding'
}

/**
 * Get the type of sykmelding
 * Used for displaying the title.
 * @return {string}
 */
export function getSentSykmeldingTitle(
    sykmelding: Sykmelding | undefined,
):
    | 'Sykmeldingen er sendt'
    | 'Papirsykmeldingen er sendt'
    | 'Egenmeldingen er sendt'
    | 'Utenlandsk sykmelding er sendt' {
    if (sykmelding && isUtenlandsk(sykmelding)) {
        return 'Utenlandsk sykmelding er sendt'
    } else if (sykmelding?.papirsykmelding) {
        return 'Papirsykmeldingen er sendt'
    } else if (sykmelding?.egenmeldt) {
        return 'Egenmeldingen er sendt'
    }
    return 'Sykmeldingen er sendt'
}

/**
 * Get the first fom date of the earliest sykmelding period
 * @return {Date} The start date
 */
export function getSykmeldingStartDate(perioder: readonly { readonly fom: string }[]): string {
    return perioder.reduce((acc, value) => (isBefore(toDate(value.fom), toDate(acc.fom)) ? value : acc)).fom
}

/**
 * Get the last tom date of the last sykmelding period
 * @return {Date} The end date
 */
export function getSykmeldingEndDate(perioder: readonly { readonly fom: string; readonly tom: string }[]): string {
    return perioder.reduce((acc, value) => (isAfter(toDate(value.fom), toDate(acc.fom)) ? value : acc)).tom
}

/**
 * Get the text representation of the sykmelding length from start date to end date
 * @return {string} The sykmelding length
 */
export function getReadableSykmeldingLength(sykmelding: Sykmelding): string {
    const perioder = sykmelding.sykmeldingsperioder

    const startDate = getSykmeldingStartDate(perioder)
    const endDate = getSykmeldingEndDate(perioder)

    return toReadableDatePeriod(startDate, endDate)
}

export function isV3(sykmelding: Sykmelding): boolean {
    return sykmelding.rulesetVersion === 3
}

export function isValidRange(sykmelding: Sykmelding): boolean {
    const start = getSykmeldingStartDate(sykmelding.sykmeldingsperioder)
    const end = getSykmeldingEndDate(sykmelding.sykmeldingsperioder)

    return isBefore(toDate(start), toDate(end))
}

const API_PATH_REGEX = /^\/api\/flex-sykmeldinger-backend\/api\/v1\/sykmeldinger\/([^/]+)\/send$/

export function extractSykmeldingIdFromUrl(url: string): string | null {
    const match = url.match(API_PATH_REGEX)
    return match ? match[1] : null
}

const SAFE_ID_REGEX = /^[a-zA-Z0-9:._-]{1,80}$/

export function validateSykmeldingId(sykmeldingId?: string | string[] | null): string {
    if (!isValidSykmeldingId(sykmeldingId)) {
        throw new Error(`sykmeldingId inneholder ugyldige tegn: ${sykmeldingId}`)
    }
    return sykmeldingId.trim()
}

export function isValidSykmeldingId(sykmeldingId?: string | string[] | null): sykmeldingId is string {
    if (!sykmeldingId || typeof sykmeldingId !== 'string' || sykmeldingId.trim() === '') {
        return false
    }
    return SAFE_ID_REGEX.test(sykmeldingId.trim())
}

export function isPostSykmeldingSend(url: string): boolean {
    const id = extractSykmeldingIdFromUrl(url)
    return id !== null && isValidSykmeldingId(id)
}
