import { closestTo, isBefore, isSameDay, isWithinInterval } from 'date-fns'
import { intersection } from 'remeda'

import { Periodetype, Sykmelding } from '../types/sykmelding/sykmelding'

import { toDate } from './dateUtils'
import { getSykmeldingEndDate, getSykmeldingStartDate, isSendtSykmelding, isValidRange } from './sykmeldingUtils'

function removeInsideSykmeldinger(sykmeldinger: readonly Sykmelding[]) {
    return (sykmelding: Sykmelding): boolean => {
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

export function findPrevSykmeldingTom(
    sykmelding: Sykmelding,
    valgtArbeidsgiverOrgnummer: string | null | undefined,
    alleSykmeldinger: Sykmelding[],
): Date | null {
    const sendtSykmeldinger = alleSykmeldinger
        .filter(removeInsideSykmeldinger(alleSykmeldinger))
        .filter(isSendtSykmelding)
        .filter((it) => it.id !== sykmelding.id)
        .filter((it) => it.sykmeldingStatus.arbeidsgiver?.orgnummer == valgtArbeidsgiverOrgnummer)
        .filter(removeAvventende)

    const latestTomForGivenSykmelding: Date = toDate(getSykmeldingEndDate(sykmelding.sykmeldingsperioder))
    const latestTomList: Date[] = sendtSykmeldinger
        .flatMap((it) => toDate(getSykmeldingEndDate(it.sykmeldingsperioder)))
        .filter((date) => isBefore(date, latestTomForGivenSykmelding) || isSameDay(date, latestTomForGivenSykmelding))

    const nearestTom: Date | undefined = closestTo(latestTomForGivenSykmelding, latestTomList)

    return nearestTom ?? null
}

function removeAvventende(sykmelding: Sykmelding): boolean {
    return (
        intersection(
            [Periodetype.AVVENTENDE],
            sykmelding.sykmeldingsperioder.map((it) => it.type),
        ).length === 0
    )
}
