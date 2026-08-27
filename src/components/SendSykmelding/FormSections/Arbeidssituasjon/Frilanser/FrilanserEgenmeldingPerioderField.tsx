import React, { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { DatePicker, DateValidationT, useDatepicker } from '@navikt/ds-react'
import { sub, toDate } from 'date-fns'

import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { toReadableDate } from '../../../../../utils/dateUtils'

interface Props {
    sykmeldingStartDato: string
    tidligsteFom?: string | null
}

function FrilanserEgenmeldingPerioderField({ sykmeldingStartDato, tidligsteFom }: Props): ReactElement {
    const [dateValidation, setDateValidation] = useState<DateValidationT | null>(null)

    const maksAntallDager = 16
    const dagenFoerSykmeldingen = sub(toDate(sykmeldingStartDato), { days: 1 })
    const tidligsteDato = tidligsteFom
        ? toDate(tidligsteFom)
        : sub(toDate(sykmeldingStartDato), { days: maksAntallDager })
    const beskrivelse = tidligsteFom
        ? `Du kan velge fra og med ${toReadableDate(tidligsteDato)}. Den forrige sykmeldingen din dekker perioden før dette.`
        : `Du kan velge opptil ${maksAntallDager} dager før sykmeldingsdatoen.`

    const { field: fromField, fieldState: fromFieldState } = useController<FormValues, `egenmeldingsperioder.0.fom`>({
        name: `egenmeldingsperioder.0.fom`,
        rules: {
            validate: (fomValue) => {
                if (dateValidation?.isInvalid) {
                    return 'Datoen må være på formatet DD.MM.YYYY.'
                } else if (dateValidation?.isAfter) {
                    return 'Datoen kan ikke være på eller etter sykmeldingens startdato.'
                } else if (dateValidation?.isBefore) {
                    return `Datoen kan ikke være tidligere enn ${toReadableDate(tidligsteDato)}.`
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

    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: tidligsteDato,
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
                    description={beskrivelse}
                    placeholder="DD.MM.ÅÅÅÅ"
                    error={fromFieldState.error?.message}
                />
            </DatePicker>
        </QuestionWrapper>
    )
}

export default FrilanserEgenmeldingPerioderField
