import { closestTo, isBefore, isSameDay, isWithinInterval } from 'date-fns'
import { intersection } from 'remeda'

import { Periodetype, SykmeldingFragment } from '../../src/fetching/graphql.generated'
import { toDate } from '../utils/dateUtils'
import { getSykmeldingEndDate, getSykmeldingStartDate, isSendtSykmelding, isValidRange } from '../utils/sykmeldingUtils'

import useSykmeldinger from './useSykmeldingerFlexBackend'

function removeInsideSykmeldinger(sykmeldinger: readonly SykmeldingFragment[]) {
    return (sykmelding: SykmeldingFragment): boolean => {
        const others = sykmeldinger
            .filter(isSendtSykmelding)
            .filter(isValidRange)
            .filter((it) => it.id !== sykmelding.id)

        return !others.some((other) => {
            const otherInterval = {
                start: toDate(getSykmeldingStartDate(other.sykmeldingsperioder)),
                end: toDate(getSykmeldingEndDate(other.sykmeldingsperioder)),
            }

            return (
                isWithinInterval(toDate(getSykmeldingStartDate(sykmelding.sykmeldingsperioder)), otherInterval) &&
                isWithinInterval(toDate(getSykmeldingEndDate(sykmelding.sykmeldingsperioder)), otherInterval)
            )
        })
    }
}

export function useFindPrevSykmeldingTom(
    sykmelding: SykmeldingFragment,
    valgtArbeidsgiverOrgnummer: string | null | undefined,
): {
    previousSykmeldingTom: Date | null
    isLoading: boolean
    error: Error | null
} {
    const { data, error, isPending: loading } = useSykmeldinger()

    if (loading || error || data == null) {
        return {
            previousSykmeldingTom: null,
            isLoading: loading,
            error,
        }
    }

    const sendtSykmeldinger = data
        .filter(removeInsideSykmeldinger(data))
        .filter(isSendtSykmelding)
        .filter((it) => it.id !== sykmelding.id)
        .filter((it) => it.sykmeldingStatus.arbeidsgiver?.orgnummer == valgtArbeidsgiverOrgnummer)
        .filter(removeAvventende)

    const latestTomForGivenSykmelding: Date = toDate(getSykmeldingEndDate(sykmelding.sykmeldingsperioder))
    const latestTomList: Date[] = sendtSykmeldinger
        .flatMap((it) => toDate(getSykmeldingEndDate(it.sykmeldingsperioder)))
        .filter((date) => isBefore(date, latestTomForGivenSykmelding) || isSameDay(date, latestTomForGivenSykmelding))

    const nearestTom: Date | undefined = closestTo(latestTomForGivenSykmelding, latestTomList)

    return {
        previousSykmeldingTom: nearestTom ?? null,
        isLoading: false,
        error: null,
    }
}

function removeAvventende(sykmelding: SykmeldingFragment): boolean {
    return (
        intersection(
            [Periodetype.AVVENTENDE],
            sykmelding.sykmeldingsperioder.map((it) => it.type),
        ).length === 0
    )
}
