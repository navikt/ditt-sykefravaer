import { useFormContext } from 'react-hook-form'
import { isSameDay } from 'date-fns'

import {
    isArbeidstaker,
    isFisker,
    isFrilanserOrNaeringsdrivendeOrJordbruker,
} from '../../../../utils/arbeidssituasjonUtils'
import { hasCompletedEgenmeldingsdager } from '../../../../utils/egenmeldingsdagerUtils'
import { FormValues } from '../../SendSykmeldingForm'
import useSykmeldinger from '../../../../hooks/useSykmeldingerFlexBackend'
import { toDate } from '../../../../utils/dateUtils'
import { getSykmeldingEndDate, getSykmeldingStartDate } from '../../../../utils/sykmeldingUtils'
import { EgenmeldingsdagerFormValue } from '../../../FormComponents/Egenmelding/EgenmeldingerFieldHelpers'
import { Sykmelding } from '../../../../types/sykmelding'
import { ArbeidssituasjonType } from '../../../../types/sykmeldingCommon'
import { BrukerinformasjonFragment } from '../../../../fetching/graphql.generated'

type UseDynamicSubSections = {
    shouldShowArbeidsgiverOrgnummer: boolean
    shouldShowFisker: boolean
}

export function useArbeidssituasjonSubSections(): UseDynamicSubSections {
    const { watch } = useFormContext<FormValues>()
    const [arbeidssituasjon] = watch(['arbeidssituasjon'])

    const shouldShowArbeidsgiverOrgnummer: boolean = isArbeidstaker(arbeidssituasjon)

    return {
        shouldShowArbeidsgiverOrgnummer,
        shouldShowFisker: isFisker(arbeidssituasjon),
    }
}

/**
 * When user is arbeidsgiver, we should show the "Sendes til arbeidsgiver" info if:
 * - User has selected an active arbeidsgiver
 *   - has selected nærmeste leder
 *   - has skipped nærmeste leder because it's inactive
 * - User has filled out egenmeldingsdager
 *   - until user has hit previous sykmelding date, or answers no on "Har du flere egenmeldingsdager?"
 *   - has skipped egenmeldingsdager because it's not relevant
 */
export function useShouldShowSendesTilArbeidsgiverInfo(): boolean {
    const { watch } = useFormContext<FormValues>()
    const [arbeidssituasjon, arbeidsgiverOrgnummer, fisker, egenmeldingsdager, egenmeldingsdagerHitPrevious] = watch([
        'arbeidssituasjon',
        'arbeidsgiverOrgnummer',
        'fisker',
        'egenmeldingsdager',
        'egenmeldingsdagerHitPrevious',
    ])

    const arbeidstaker: boolean = isArbeidstaker(arbeidssituasjon, fisker)
    const hasSelectedArbeidstaker: boolean = arbeidsgiverOrgnummer != null
    const egenmeldingsdagerCompletedOrSkipped: boolean = isEgenmeldingsdagerCompleteOrSkipped(
        arbeidssituasjon,
        egenmeldingsdager,
        egenmeldingsdagerHitPrevious,
        fisker,
    )

    return arbeidstaker && hasSelectedArbeidstaker && egenmeldingsdagerCompletedOrSkipped
}

export function useShouldShowSummaryForFrilanser(): boolean {
    const { watch } = useFormContext<FormValues>()
    const [arbeidssituasjon, egenmeldingsdager, egenmeldingsdagerHitPrevious] = watch([
        'arbeidssituasjon',
        'egenmeldingsdager',
        'egenmeldingsdagerHitPrevious',
    ])

    const frilanserOrNaeringsdrivendeOrJordbruker: boolean = isFrilanserOrNaeringsdrivendeOrJordbruker(arbeidssituasjon)
    const egenmeldingsdagerCompletedOrSkipped: boolean = isEgenmeldingsdagerCompleteOrSkipped(
        arbeidssituasjon,
        egenmeldingsdager,
        egenmeldingsdagerHitPrevious,
    )

    return frilanserOrNaeringsdrivendeOrJordbruker && egenmeldingsdagerCompletedOrSkipped
}

function isEgenmeldingsdagerCompleteOrSkipped(
    arbeidssituasjon: ArbeidssituasjonType | null,
    egenmeldingsdager: EgenmeldingsdagerFormValue[] | null,
    egenmeldingsdagerHitPrevious: boolean | null,
    fisker?: FormValues['fisker'],
): boolean {
    return (
        hasCompletedEgenmeldingsdager(egenmeldingsdager) ||
        egenmeldingsdagerHitPrevious === true ||
        !isArbeidstaker(arbeidssituasjon, fisker)
    )
}

export function useShouldShowSeveralArbeidsgivereInfo(
    arbeidsgivere: BrukerinformasjonFragment['arbeidsgivere'],
    sykmelding: Sykmelding,
): {
    shouldAskForSeveralSykmeldinger: boolean | null
    isLoading: boolean
    error: Error | null
} {
    const { data, error, isPending: loading } = useSykmeldinger()

    if (loading || error || data == null) {
        return {
            shouldAskForSeveralSykmeldinger: null,
            isLoading: loading,
            error,
        }
    }

    const activeArbeidsforhold: BrukerinformasjonFragment['arbeidsgivere'] = arbeidsgivere.filter(
        (arbeidsgiver) => arbeidsgiver.aktivtArbeidsforhold,
    )

    const sykmeldingerWithSamePeriod: Sykmelding[] = data
        ?.filter((it) => it.id !== sykmelding.id)
        .filter((it) => isFomTheSameAndTomTheSame(it, sykmelding))

    const isArbeidsgiverGreaterThenSykmelding: boolean =
        activeArbeidsforhold.length >= 2 && activeArbeidsforhold.length - 1 > sykmeldingerWithSamePeriod.length

    return {
        shouldAskForSeveralSykmeldinger: isArbeidsgiverGreaterThenSykmelding,
        isLoading: loading,
        error,
    }
}

function isFomTheSameAndTomTheSame(sykmelding: Sykmelding, relevantSykmelding: Sykmelding): boolean {
    const sykmeldingFom = toDate(getSykmeldingStartDate(sykmelding.sykmeldingsperioder))
    const sykmeldingTom = toDate(getSykmeldingEndDate(sykmelding.sykmeldingsperioder))

    const relevantSykmeldingFom = toDate(getSykmeldingStartDate(relevantSykmelding.sykmeldingsperioder))
    const relevantSykmeldingTom = toDate(getSykmeldingEndDate(relevantSykmelding.sykmeldingsperioder))

    return isSameDay(sykmeldingFom, relevantSykmeldingFom) && isSameDay(sykmeldingTom, relevantSykmeldingTom)
}
