import { Alert, Button, ErrorMessage } from '@navikt/ds-react'
import { useController, useFormContext } from 'react-hook-form'
import { isAfter, isSameDay } from 'date-fns'
import { ReactElement, useEffect, useLayoutEffect } from 'react'
import * as R from 'remeda'
import cn from 'classnames'

import { sortDatesASC } from '../../../utils/dateUtils'
import { logAmplitudeEvent } from '../../amplitude/amplitude'
import { YesOrNo } from '../../../types/sykmeldingCommon'

import HarBruktEgenmelding from './HarBruktEgenmelding'
import ValgtEgenmeldingsdager from './ValgtEgenmeldingsdager'
import EgenmeldingDatesPickerSubField from './EgenmeldingDatesPickerSubField'
import { cumulativeDays, currentPeriodDatePicker } from './egenmeldingsdagerFieldUtils'
import { EgenmeldingsdagerFormValue, MAX_EGENMELDINGSDAGER } from './EgenmeldingerFieldHelpers'

export type EgenmeldingsdagerSubForm = {
    egenmeldingsdager: EgenmeldingsdagerFormValue[] | null
    egenmeldingsdagerHitPrevious: boolean | null
}

interface Props {
    index: number
    previous: {
        earliestPossibleDate: Date
        earliestSelectedDate: Date | null
    }
    metadata: {
        previousSykmeldingTom: Date | null
        arbeidsgiverNavn: string
    }
    editSentEgenmelding?: boolean
    amplitudeSkjemanavn: string
}

function EgenmeldingerField({
    index,
    previous,
    metadata,
    editSentEgenmelding = false,
    amplitudeSkjemanavn,
}: Props): ReactElement | null {
    const { watch, setValue, getValues } = useFormContext<EgenmeldingsdagerSubForm>()
    const allPeriods: EgenmeldingsdagerFormValue[] = watch('egenmeldingsdager') ?? []
    const harPerioder: YesOrNo | null = watch(`egenmeldingsdager.${index}.harPerioder`)
    const selectedDates: Date[] | null = watch(`egenmeldingsdager.${index}.datoer`)
    const hasClickedVidere: boolean | null = watch(`egenmeldingsdager.${index}.hasClickedVidere`)
    const egenmeldingsdagerHitPrevious: boolean | null = watch('egenmeldingsdagerHitPrevious')

    const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(allPeriods, index)
    const [earliestPossibleDate, latestPossibleDate] = currentPeriodDatePicker(previous, metadata.previousSykmeldingTom)
    const hasHitPreviousSykmeldingTom = isAfter(earliestPossibleDate, latestPossibleDate)

    useLayoutEffect(() => {
        if (hasHitPreviousSykmeldingTom && egenmeldingsdagerHitPrevious == null) {
            setValue('egenmeldingsdagerHitPrevious', true)
        }
    }, [setValue, hasHitPreviousSykmeldingTom, egenmeldingsdagerHitPrevious])

    useEffect(() => {
        logAmplitudeEvent(
            {
                eventName: 'skjema steg fullført',
                data: { skjemanavn: amplitudeSkjemanavn, steg: 'Har truffet forrige sykmelding tom' },
            },
            { level: index + 1 },
        )
    }, [index, amplitudeSkjemanavn, hasHitPreviousSykmeldingTom])

    if (hasHitPreviousSykmeldingTom) {
        // The user has hit the previous sykmelding, we don't need to ask anymore.
        return null
    }

    if (cumulativeBefore >= MAX_EGENMELDINGSDAGER) {
        // The previous recursive period maxed out the number of days
        return null
    }

    const missingDates: boolean = !selectedDates || selectedDates.length === 0
    const missingDatesOnVidereClick: boolean = missingDates && hasClickedVidere === false
    const sortedDates: Date[] | null = selectedDates && selectedDates.length > 0 ? sortDatesASC(selectedDates) : null
    const hasPeriod: boolean = harPerioder === YesOrNo.YES

    return (
        <>
            <section
                aria-labelledby={`egenmeldingsdager.${index}.harPerioder`}
                className={cn({ 'mt-10 border-t-2 border-border-divider': index !== 0 })}
                // Overly complex date edge case in in egenmeldingsdager.spec.tsx requires this
                data-testid={
                    index === allPeriods.filter((it) => it.hasClickedVidere).length
                        ? 'last-egenmelding-section'
                        : undefined
                }
            >
                <HarBruktEgenmelding
                    index={index}
                    arbeidsgiverNavn={metadata.arbeidsgiverNavn}
                    lastPossibleDate={earliestPossibleDate}
                    firstPossibleDate={latestPossibleDate}
                    onNo={() => {
                        setValue(`egenmeldingsdager.${index}.datoer`, null)
                        setValue(`egenmeldingsdager.${index}.hasClickedVidere`, null)
                        setValue(
                            'egenmeldingsdager',
                            laterPeriodsRemoved(index, editSentEgenmelding, getValues('egenmeldingsdager')),
                        )
                    }}
                    amplitudeSkjemanavn={amplitudeSkjemanavn}
                />
                {hasPeriod && hasClickedVidere !== true && (
                    <>
                        <EgenmeldingDatesPickerSubField
                            index={index}
                            earliestPossibleDate={earliestPossibleDate}
                            latestPossibleDate={latestPossibleDate}
                            resetClickedVidere={() => setValue(`egenmeldingsdager.${index}.hasClickedVidere`, null)}
                            disabled={[
                                (date) => {
                                    if (cumulativeIncluding >= MAX_EGENMELDINGSDAGER)
                                        return !selectedDates?.some((d) => isSameDay(d, date))

                                    return false
                                },
                            ]}
                        />
                        <VidereButtonField index={index} missingDates={missingDates} />
                        {missingDatesOnVidereClick && (
                            <ErrorMessage className="mt-4">Du må velge minst en dato</ErrorMessage>
                        )}
                    </>
                )}
                {hasPeriod && hasClickedVidere === true && sortedDates && sortedDates.length > 0 && (
                    <ValgtEgenmeldingsdager
                        dates={sortedDates}
                        onEditClicked={() => {
                            setValue(
                                'egenmeldingsdager',
                                laterPeriodsRemoved(index, editSentEgenmelding, getValues('egenmeldingsdager')),
                            )
                            setValue(`egenmeldingsdager.${index}.hasClickedVidere`, null)
                        }}
                    />
                )}
            </section>
            {hasClickedVidere === true && (
                <EgenmeldingerField
                    index={index + 1}
                    metadata={metadata}
                    previous={{
                        earliestSelectedDate: sortedDates ? sortedDates[0] : null,
                        earliestPossibleDate: earliestPossibleDate,
                    }}
                    editSentEgenmelding={editSentEgenmelding}
                    amplitudeSkjemanavn={amplitudeSkjemanavn}
                />
            )}
            {cumulativeIncluding >= MAX_EGENMELDINGSDAGER && (
                <Alert variant="info" className="my-8">
                    Du har valgt 16 egenmeldingsdager, og trenger ikke å velge flere.
                </Alert>
            )}
        </>
    )
}

function VidereButtonField({ index, missingDates }: { index: number; missingDates: boolean }): ReactElement {
    const { field, fieldState } = useController<
        EgenmeldingsdagerSubForm,
        `egenmeldingsdager.${number}.hasClickedVidere`
    >({
        name: `egenmeldingsdager.${index}.hasClickedVidere`,
        rules: {
            required: 'Du må klikke deg videre når du har valgt datoene du har brukt egenmelding på',
        },
    })

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                onClick={() => {
                    if (missingDates) {
                        field.onChange(false)
                    } else {
                        field.onChange(true)
                    }
                }}
            >
                Videre
            </Button>
            {fieldState.error && <ErrorMessage>{fieldState.error.message}</ErrorMessage>}
        </>
    )
}

export function laterPeriodsRemoved(
    index: number,
    editSentEgenmelding: boolean,
    list?: readonly EgenmeldingsdagerFormValue[] | null,
): EgenmeldingsdagerFormValue[] | null {
    if (list == null) return null

    if (editSentEgenmelding) {
        return R.pipe(
            list,
            R.take(index + 1),
            R.concat(
                R.range(0, list.length - index - 1).map(() => ({
                    harPerioder: null,
                    datoer: null,
                    hasClickedVidere: null,
                })),
            ),
        )
    }

    return R.pipe(list, R.take(index + 1))
}

export default EgenmeldingerField
