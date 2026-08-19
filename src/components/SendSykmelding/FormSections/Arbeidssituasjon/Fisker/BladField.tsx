import React, { ReactElement } from 'react'
import { Box, Radio, RadioGroup } from '@navikt/ds-react'
import { useController } from 'react-hook-form'

import { Blad } from '../../../../../types/sykmelding/sykmeldingCommon'
import { bladbeskrivelse, bladTittel, sporsmal } from '../../../../../utils/sporsmal'
import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'

function BladField(): ReactElement {
    const { field, fieldState } = useController<FormValues>({
        name: 'fisker.blad',
        rules: { required: 'Du må svare på hvilket blad' },
    })

    const bladtyper: Blad[] = [Blad.B, Blad.A, Blad.Ingen]
    return (
        <QuestionWrapper className={'mt-6'}>
            <RadioGroup
                {...field}
                id={field.name}
                legend={sporsmal.arbeidssituasjon}
                hideLegend
                error={fieldState.error?.message}
            >
                {bladtyper.map((blad) => {
                    const beskrivelse = bladbeskrivelse(blad)
                    return (
                        <Box
                            key={blad}
                            paddingInline="space-8"
                            borderWidth="2"
                            borderRadius="12"
                            borderColor="neutral-subtle"
                            className="mb-2 focus-within:border-ax-border-accent focus-within:bg-ax-bg-accent-soft"
                        >
                            <Radio
                                key={blad}
                                value={blad}
                                {...(beskrivelse ? { description: beskrivelse } : {})}
                                className="w-full"
                            >
                                <span className="font-medium">{bladTittel(blad)}</span>
                            </Radio>
                        </Box>
                    )
                })}
            </RadioGroup>
        </QuestionWrapper>
    )
}

export default BladField
