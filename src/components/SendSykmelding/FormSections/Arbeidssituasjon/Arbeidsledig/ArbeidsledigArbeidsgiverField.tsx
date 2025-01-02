import React, { ReactElement } from 'react'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { useController, useFormContext } from 'react-hook-form'

import { ArbeidssituasjonType } from '../../../../../fetching/graphql.generated'
import { QuestionWrapper, SectionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { logAmplitudeEvent } from '../../../../amplitude/amplitude'
import { TidligereArbeidsgiver, TidligereArbeidsgivereArray } from '../../../../../hooks/useTidligereArbeidsgivereById'

interface Props {
    arbeidsgivere: TidligereArbeidsgivereArray
}

function ArbeidsledigArbeidsgiverField({ arbeidsgivere }: Props): ReactElement | null {
    const { field, fieldState } = useController<FormValues>({
        name: 'arbeidsledig.arbeidsledigFraOrgnummer',
        rules: { required: 'Du må svare på hvilket arbeid du har blitt arbeidsledig fra.' },
    })
    const { watch } = useFormContext<FormValues>()
    const arbeidssituasjon = watch('arbeidssituasjon') ?? ArbeidssituasjonType.ARBEIDSLEDIG

    return (
        <SectionWrapper>
            <QuestionWrapper>
                <RadioGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.arbeidsledigFra(arbeidssituasjon)}
                    onChange={(value) => {
                        logAmplitudeEvent({
                            eventName: 'skjema spørsmål besvart',
                            data: {
                                skjemanavn: 'endret arbeidssituasjon',
                                spørsmål: sporsmal.arbeidsledigFra(arbeidssituasjon),
                                svar: value,
                            },
                        })
                        field.onChange(value)
                    }}
                    error={fieldState.error?.message}
                >
                    {arbeidsgivere.map((arbeidsgiver: TidligereArbeidsgiver) => (
                        <Radio
                            key={arbeidsgiver?.orgnummer}
                            value={arbeidsgiver?.orgnummer}
                            className="overflow-anywhere"
                            description={`org.nr: ${arbeidsgiver?.orgnummer}`}
                        >
                            {arbeidsgiver?.orgNavn}
                        </Radio>
                    ))}
                    <Radio key="ikke-relevant" value="ingen" className="overflow-anywhere">
                        Ikke relevant
                    </Radio>
                </RadioGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}

export default ArbeidsledigArbeidsgiverField
