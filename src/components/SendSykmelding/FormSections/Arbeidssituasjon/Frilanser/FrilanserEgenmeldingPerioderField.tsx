import { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { Alert, DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { isBefore, sub, toDate } from 'date-fns'

import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { toReadableDate } from '../../../../../utils/dateUtils'

interface Props {
    sykmeldingStartDato: string
}

function FrilanserEgenmeldingPerioderField({ sykmeldingStartDato }: Props): ReactElement {
    const [dateValidation, setDateValidation] = useState<DateValidationT | null>(null)
    const { field: fromField, fieldState: fromFieldState } = useController<FormValues, `egenmeldingsperioder.0.fom`>({
        name: `egenmeldingsperioder.0.fom`,
        rules: {
            validate: (fomValue) => {
                if (dateValidation?.isInvalid) {
                    return 'Datoen må være på formatet DD.MM.YYYY.'
                } else if (dateValidation?.isAfter) {
                    return 'Datoen kan ikke være på eller etter sykmeldingens start-dato.'
                } else if (dateValidation?.isBefore) {
                    return 'Datoen kan ikke være tidligere enn et år før sykmeldingens start-dato.'
                } else if (!fomValue) {
                    return 'Du må fylle inn en dato.'
                } else {
                    return undefined
                }
            },
        },
    })

    const { field: toField } = useController<FormValues, `egenmeldingsperioder.0.tom`>({
        name: `egenmeldingsperioder.0.tom`,
    })

    const dagenFoerSykmeldingen = sub(toDate(sykmeldingStartDato), { days: 1 })
    const sekstenDagerFoerSykmeldingen = sub(toDate(sykmeldingStartDato), { days: 16 })
    const aarFoerSykmeldingen = sub(toDate(sykmeldingStartDato), { years: 1 })
    const harValgtForTidlig = fromField.value && isBefore(toDate(fromField.value), sekstenDagerFoerSykmeldingen)

    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: aarFoerSykmeldingen,
        toDate: dagenFoerSykmeldingen,
        defaultSelected: fromField.value ?? undefined,
        allowTwoDigitYear: false,
        required: true,
        onDateChange: (value) => {
            if (value) {
                fromField.onChange(value)
                toField.onChange(dagenFoerSykmeldingen)
            }
        },
        onValidate: setDateValidation,
    })

    return (
        <QuestionWrapper>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    id={fromField.name}
                    {...inputProps}
                    ref={fromField.ref}
                    label={sporsmal.egenmeldingsperioder()}
                    placeholder="DD.MM.ÅÅÅÅ"
                    error={fromFieldState.error?.message}
                />
            </DatePicker>
            {harValgtForTidlig && (
                <Alert variant="warning" role="alert" aria-live="polite" className="mt-4">
                    Selv om du ga beskjed til Nav {toReadableDate(fromField.value!)} så har du ikke rett på sykepenger
                    for mer enn 16 dager før du ble sykmeldt {toReadableDate(sykmeldingStartDato)}. Vi vil derfor bruke{' '}
                    {toReadableDate(sekstenDagerFoerSykmeldingen)} som startdato for sykefraværet ditt.
                </Alert>
            )}
        </QuestionWrapper>
    )
}

export default FrilanserEgenmeldingPerioderField
