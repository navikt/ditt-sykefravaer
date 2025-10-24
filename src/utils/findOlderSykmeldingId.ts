import { isBefore, parseISO } from 'date-fns'

import { Sykmelding } from '../types/sykmelding/sykmelding'

import { getSykmeldingStartDate, isActiveSykmelding, isUnderbehandling } from './sykmeldingUtils'

/**
 * Used by reduce to find the earliest sykmelding
 */
export function toEarliestSykmelding(acc: Sykmelding, value: Sykmelding): Sykmelding {
    const valuePerioder = value.sykmeldingsperioder
    const accPerioder = acc.sykmeldingsperioder

    return isBefore(parseISO(getSykmeldingStartDate(valuePerioder)), parseISO(getSykmeldingStartDate(accPerioder)))
        ? value
        : acc
}

export function filterUnsentSykmeldinger(sykmeldinger: Sykmelding[]): Sykmelding[] {
    return sykmeldinger.filter((it) => isActiveSykmelding(it) && !isUnderbehandling(it))
}

export function findOlderSykmeldingId(
    sykmelding: Sykmelding | undefined,
    alleSykmeldinger: Sykmelding[],
): {
    earliestSykmeldingId: string | null
    olderSykmeldingCount: number
} {
    if (sykmelding == null) {
        return {
            earliestSykmeldingId: null,
            olderSykmeldingCount: 0,
        }
    }
    const unsentSykmeldinger = filterUnsentSykmeldinger(alleSykmeldinger)

    const startDate: string = getSykmeldingStartDate(sykmelding.sykmeldingsperioder)
    const unsentExceptOverlappingDates = unsentSykmeldinger.filter(
        (it) => getSykmeldingStartDate(it.sykmeldingsperioder) !== startDate,
    )

    const earliestSykmelding = unsentExceptOverlappingDates.reduce(toEarliestSykmelding, sykmelding)
    const earliestId = earliestSykmelding.id

    return {
        // When the earliest sykmelding is the provided sykmelding, it's the very first
        earliestSykmeldingId: earliestId === sykmelding.id ? null : earliestId,
        olderSykmeldingCount: unsentExceptOverlappingDates.length,
    }
}
