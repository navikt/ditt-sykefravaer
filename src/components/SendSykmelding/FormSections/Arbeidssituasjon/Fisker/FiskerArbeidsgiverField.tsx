import React, { ReactElement, useRef, useState } from 'react'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { useController } from 'react-hook-form'

import { QuestionWrapper, SectionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import { FormValues } from '../../../SendSykmeldingForm'
import { logUmamiEvent } from '../../../../umami/umami'
import { Arbeidsgiver } from '../../../../../types/sykmelding/brukerinformasjon'

const IKKE_OPPGITT = 'ikke-oppgitt'

interface Props {
    arbeidsgivere: Arbeidsgiver[]
}

export default function FiskerArbeidsgiverField({ arbeidsgivere }: Props): ReactElement | null {
    const [ikkeOppgittValgt, setIkkeOppgittValgt] = useState(false)
    const ikkeOppgittValgtRef = useRef(false)

    const { field, fieldState } = useController<FormValues>({
        name: 'arbeidsgiverOrgnummer',
        rules: {
            validate: (value) =>
                value != null ||
                ikkeOppgittValgtRef.current ||
                'Du må svare på hvilken arbeidsgiver du er sykmeldt fra.',
        },
    })

    return (
        <SectionWrapper>
            <QuestionWrapper>
                <RadioGroup
                    {...field}
                    value={ikkeOppgittValgt ? IKKE_OPPGITT : field.value}
                    id={field.name}
                    legend={sporsmal.arbeidsgiverOrgnummer}
                    onChange={(value: string) => {
                        logUmamiEvent({
                            eventName: 'skjema spørsmål besvart',
                            data: {
                                skjemanavn: 'endret arbeidssituasjon',
                                spørsmål: sporsmal.arbeidsgiverOrgnummer,
                                svar: value,
                            },
                        })
                        const erIkkeOppgitt = value === IKKE_OPPGITT
                        ikkeOppgittValgtRef.current = erIkkeOppgitt
                        setIkkeOppgittValgt(erIkkeOppgitt)
                        field.onChange(erIkkeOppgitt ? null : value)
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
                    <Radio key={IKKE_OPPGITT} value={IKKE_OPPGITT} className="overflow-anywhere">
                        Ikke oppgitt
                    </Radio>
                </RadioGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}
