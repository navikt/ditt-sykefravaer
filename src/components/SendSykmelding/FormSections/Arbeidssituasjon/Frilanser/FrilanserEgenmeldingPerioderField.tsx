import React, { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { Alert, BodyShort, DatePicker, DateValidationT, Link, useDatepicker } from '@navikt/ds-react'
import { isMonday, sub, toDate } from 'date-fns'
import { LinkIcon } from '@navikt/aksel-icons'

import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { toReadableDate } from '../../../../../utils/dateUtils'

interface Props {
    sykmeldingStartDato: string
}

function FrilanserEgenmeldingPerioderField({ sykmeldingStartDato }: Props): ReactElement {
    const [dateValidation, setDateValidation] = useState<DateValidationT | null>(null)

    const erMandag = isMonday(toDate(sykmeldingStartDato))
    const antallDager = erMandag ? 18 : 16

    const { field: fromField, fieldState: fromFieldState } = useController<FormValues, `egenmeldingsperioder.0.fom`>({
        name: `egenmeldingsperioder.0.fom`,
        rules: {
            validate: (fomValue) => {
                if (dateValidation?.isInvalid) {
                    return 'Datoen må være på formatet DD.MM.YYYY.'
                } else if (dateValidation?.isAfter) {
                    return 'Datoen kan ikke være på eller etter sykmeldingens startdato.'
                } else if (dateValidation?.isBefore) {
                    return `Datoen kan ikke være tidligere enn ${antallDager} dager før sykmeldingens startdato.`
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
    const tidligsteDato = sub(toDate(sykmeldingStartDato), { days: antallDager })

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
                    description={`Du kan velge opptil ${antallDager} dager før sykmeldingsdatoen.`}
                    placeholder="DD.MM.ÅÅÅÅ"
                    error={fromFieldState.error?.message}
                />
            </DatePicker>
            {fromField.value && (
                <Alert variant="info" role="alert" aria-live="polite" className="mt-4">
                    <BodyShort spacing>
                        Du ga beskjed til Nav {toReadableDate(fromField.value)}. Hvis vi har dokumentasjon på at du ga
                        beskjed fra denne datoen, setter vi det som startdato for sykefraværet ditt.
                    </BodyShort>
                    <BodyShort>
                        <Link href="https://www.nav.no/sykepenger" target="_blank">
                            Les mer om sykepenger
                            <LinkIcon aria-hidden={true} />
                        </Link>
                    </BodyShort>
                </Alert>
            )}
        </QuestionWrapper>
    )
}

export default FrilanserEgenmeldingPerioderField
