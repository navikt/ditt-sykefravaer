import { isBefore, parseISO } from 'date-fns'

import { getSykmeldingStartDate, isActiveSykmelding, isUnderbehandling } from '../utils/sykmeldingUtils'
import { Sykmelding } from '../types/sykmelding'

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

type SykmeldingerHook = () => {
    data?: Sykmelding[]
    error: Error | null
    isPending: boolean
}

export function useUnsentSykmeldinger(sykmeldingerHook: SykmeldingerHook): {
    unsentSykmeldinger: Sykmelding[] | null
    isLoading: boolean
    error: Error | null
} {
    const { data, error, isPending: loading } = sykmeldingerHook()

    if (loading || error || data == null) {
        return {
            unsentSykmeldinger: null,
            isLoading: loading,
            error,
        }
    }

    const relevantSykmeldinger = data?.filter((it) => isActiveSykmelding(it) && !isUnderbehandling(it))

    return {
        unsentSykmeldinger: relevantSykmeldinger,
        isLoading: false,
        error: null,
    }
}

function useFindOlderSykmeldingId(
    sykmelding: Sykmelding | undefined,
    sykmeldingerHook: SykmeldingerHook,
): {
    earliestSykmeldingId: string | null
    olderSykmeldingCount: number
    isLoading: boolean
    error: Error | null
} {
    const { unsentSykmeldinger, error, isLoading } = useUnsentSykmeldinger(sykmeldingerHook)

    if (sykmelding == null || isLoading || error || unsentSykmeldinger == null) {
        return {
            earliestSykmeldingId: null,
            olderSykmeldingCount: 0,
            isLoading,
            error,
        }
    }

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
        isLoading: false,
        error: null,
    }
}

export default useFindOlderSykmeldingId
