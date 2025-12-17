import { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { sub, toDate } from 'date-fns'

import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'

interface Props {
    oppfolgingsdato: string
}

function FrilanserEgenmeldingPerioderField({ oppfolgingsdato }: Props): ReactElement {
    const [dateValidation, setDateValidation] = useState<DateValidationT | null>(null)
    const { field: fromField, fieldState: fromFieldState } = useController<FormValues, `egenmeldingsperioder.0.fom`>({
        name: `egenmeldingsperioder.0.fom`,
        rules: {
            validate: (fomValue) => {
                if (dateValidation?.isInvalid) {
                    return 'Datoen må være på formatet DD.MM.YYYY.'
                } else if (dateValidation?.isAfter) {
                    return 'Datoen kan ikke være oppfølgingsdato eller senere.'
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

    const dagenFoerSykmeldingen = sub(toDate(oppfolgingsdato), { days: 1 })
    const { datepickerProps, inputProps } = useDatepicker({
        toDate: dagenFoerSykmeldingen,
        defaultSelected: fromField.value ?? undefined,
        allowTwoDigitYear: false,
        required: true,
        onDateChange: (value) => {
            fromField.onChange(value)
            toField.onChange(dagenFoerSykmeldingen)
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
        </QuestionWrapper>
    )
}

export default FrilanserEgenmeldingPerioderField
