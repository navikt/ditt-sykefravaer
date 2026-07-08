import { ReactElement, ReactNode } from 'react'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FieldPath, FieldPathValue, FieldValues, RegisterOptions, useController } from 'react-hook-form'

import { YesOrNo } from '../../../types/sykmelding/sykmeldingCommon'

interface Props<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName
    legend: string
    description?: string | ReactNode
    subtext?: string | ReactNode
    onChange?: (value: YesOrNo) => void
    rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    jaTekst?: string
    neiTekst?: string
}

function YesNoField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    legend,
    description,
    subtext,
    onChange,
    rules,
    jaTekst,
    neiTekst,
}: Props<TFieldValues, TName>): ReactElement {
    const { field, fieldState } = useController<TFieldValues, TName>({
        name,
        rules,
    })

    return (
        <RadioGroup
            {...field}
            id={field.name}
            legend={legend}
            description={description}
            className="overflow-anywhere"
            error={fieldState.error?.message}
            onChange={(value: YesOrNo) => {
                field.onChange(value as FieldPathValue<TFieldValues, TName>)
                onChange?.(value)
            }}
        >
            {subtext && <div className="mb-2">{subtext}</div>}
            <Radio value={YesOrNo.YES}>{jaTekst ?? 'Ja'}</Radio>
            <Radio value={YesOrNo.NO}>{neiTekst ?? 'Nei'}</Radio>
        </RadioGroup>
    )
}

export default YesNoField
