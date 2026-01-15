import { useController } from 'react-hook-form'
import { Button, DatePicker, RangeValidationT, useRangeDatepicker } from '@navikt/ds-react'
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons'
import { ReactElement, useState } from 'react'
import { Interval, isWithinInterval } from 'date-fns'

import { FormValues } from '../../../SendSykmeldingForm'

type FrilanserEgenmeldingPerioderFieldName = `egenmeldingsperioder.${number}`

interface EgenmeldingPeriodSubFieldProps {
    index: number
    remove: (index: number) => void
    oppfolgingsdato: Date
    otherPeriods: FormValues['egenmeldingsperioder']
}

function FrilanserEgenmeldingPeriodSubField({
    index,
    remove,
    oppfolgingsdato,
    otherPeriods,
}: EgenmeldingPeriodSubFieldProps): ReactElement {
    const [rangeError, setRangeError] = useState<RangeValidationT | null>(null)
    const { field: toField, fieldState: toFieldState } = useController<
        FormValues,
        `${FrilanserEgenmeldingPerioderFieldName}.tom`
    >({
        name: `egenmeldingsperioder.${index}.tom`,
        rules: {
            validate: (tomValue) => {
                if (rangeError?.to.isInvalid) {
                    return 'Til dato må være på formatet DD.MM.YYYY.'
                }
                if (rangeError?.to?.isAfter) {
                    return 'Til dato kan ikke være oppfølgingsdato eller senere.'
                }
                if (rangeError?.to?.isBeforeFrom) {
                    return 'Fra kan ikke være etter til dato.'
                }

                if (!tomValue) {
                    return 'Du må fylle inn til dato.'
                }

                return undefined
            },
        },
    })
    const { field: fromField, fieldState: fromFieldState } = useController<
        FormValues,
        `${FrilanserEgenmeldingPerioderFieldName}.fom`
    >({
        name: `egenmeldingsperioder.${index}.fom`,
        rules: {
            validate: (fomValue) => {
                if (rangeError?.from.isInvalid) {
                    return 'Fra dato må være på formatet DD.MM.YYYY.'
                }
                if (rangeError?.from?.isAfter) {
                    return 'Fra dato kan ikke være oppfølgingsdato eller senere.'
                }

                if (!fomValue) {
                    return 'Du må fylle inn fra dato.'
                }

                if (
                    otherPeriods?.some((period) => {
                        if (toField.value == null) return

                        if (period.fom == null || period.tom == null) return false
                        const interval: Interval = { start: period.fom, end: period.tom }
                        return isWithinInterval(fomValue, interval) || isWithinInterval(toField.value, interval)
                    })
                ) {
                    return 'Du kan ikke ha overlappende perioder.'
                }

                return undefined
            },
        },
    })

    const { datepickerProps, toInputProps, fromInputProps, setSelected } = useRangeDatepicker({
        toDate: oppfolgingsdato,
        today: oppfolgingsdato,
        defaultSelected: {
            from: fromField.value ?? undefined,
            to: toField.value ?? undefined,
        },
        onRangeChange: (value) => {
            value?.from && fromField.onChange(value.from)
            value?.to && toField.onChange(value.to)
        },
        onValidate: setRangeError,
    })

    const tidsperiode: string | number = (otherPeriods?.length ?? 0 > index) ? index + 1 : ''

    return (
        <li className="list-none">
            <fieldset className="relative px-4 pb-5 pt-12 bg-lightblue-50">
                <legend className="absolute top-0 left-0 p-4 font-bold">Tidsperiode {tidsperiode}</legend>
                <DatePicker
                    {...datepickerProps}
                    wrapperClassName="grid gap-2 place-items-start sm:w-[52ch] sm:grid-cols-2 grid-cols-1"
                >
                    <DatePicker.Input
                        id={fromField.name}
                        {...fromInputProps}
                        ref={fromField.ref}
                        label="Fra og med"
                        description="dd.mm.åååå"
                        error={fromFieldState.error?.message}
                    />

                    <DatePicker.Input
                        id={toField.name}
                        {...toInputProps}
                        ref={toField.ref}
                        label="Til og med"
                        description="dd.mm.åååå"
                        error={toFieldState.error?.message}
                    />
                </DatePicker>
                <div className="mt-2 flex gap-4">
                    <Button
                        variant="tertiary"
                        type="button"
                        onClick={() => {
                            setSelected({ from: undefined, to: undefined })
                            fromField.onChange(null)
                            toField.onChange(null)
                        }}
                        icon={<ArrowUndoIcon aria-hidden />}
                    >
                        Nullstill dato
                    </Button>
                    {index > 0 && (
                        <Button
                            variant="tertiary"
                            type="button"
                            icon={<TrashIcon aria-hidden />}
                            onClick={() => remove(index)}
                        >
                            Fjern periode
                        </Button>
                    )}
                </div>
            </fieldset>
        </li>
    )
}

export default FrilanserEgenmeldingPeriodSubField
