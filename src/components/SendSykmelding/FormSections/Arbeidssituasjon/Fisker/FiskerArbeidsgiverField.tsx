import React, { ReactElement } from 'react'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { useController } from 'react-hook-form'

import { QuestionWrapper, SectionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { logUmamiEvent } from '../../../../umami/umami'
import { Arbeidsgiver } from '../../../../../types/sykmelding/brukerinformasjon'

interface Props {
    arbeidsgivere: Arbeidsgiver[]
}

export default function FiskerArbeidsgiverField({ arbeidsgivere }: Props): ReactElement | null {
    const { field, fieldState } = useController<FormValues>({
        name: 'arbeidsgiverOrgnummer',
        rules: { required: 'Du må svare på hvilken arbeidsgiver du er sykmeldt fra.' },
    })

    return (
        <SectionWrapper>
            <QuestionWrapper>
                <RadioGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.arbeidsgiverOrgnummer}
                    onChange={(value) => {
                        logUmamiEvent({
                            eventName: 'skjema spørsmål besvart',
                            data: {
                                skjemanavn: 'endret arbeidssituasjon',
                                spørsmål: sporsmal.arbeidsgiverOrgnummer,
                                svar: value,
                            },
                        })
                        field.onChange(value)
                    }}
                    error={fieldState.error?.message}
                >
                    {arbeidsgivere.map((arbeidsgiver: Arbeidsgiver) => (
                        <Radio
                            key={arbeidsgiver?.orgnummer}
                            value={arbeidsgiver?.orgnummer}
                            className="overflow-anywhere"
                            description={`org.nr: ${arbeidsgiver?.orgnummer}`}
                        >
                            {arbeidsgiver?.navn}
                        </Radio>
                    ))}
                    <Radio key="ikke-relevant" value="ingen" className="overflow-anywhere">
                        Ikke oppgitt
                    </Radio>
                </RadioGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}
