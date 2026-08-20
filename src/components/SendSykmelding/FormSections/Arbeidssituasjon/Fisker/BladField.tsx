import React, { ReactElement } from 'react'
import { BodyShort, Box, Radio, RadioGroup, ReadMore } from '@navikt/ds-react'
import { useController } from 'react-hook-form'

import { Blad } from '../../../../../types/sykmelding/sykmeldingCommon'
import { bladbeskrivelse, bladTittel, sporsmal } from '../../../../../utils/sporsmal'
import { QuestionWrapper, SectionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'

function BladField(): ReactElement {
    const { field, fieldState } = useController<FormValues>({
        name: 'fisker.blad',
        rules: { required: 'Du må svare på hvilket blad' },
    })

    const bladtyper: Blad[] = [Blad.B, Blad.A, Blad.Ingen]
    return (
        <SectionWrapper title="Er du registrert som Blad B i Fiskerregisteret?" size={'small'}>
            <ReadMore header="Hva er Fiskerregisteret?">
                <BodyShort spacing>
                    Fiskerregisteret er et register over personer i Norge som har fiske som hovednæring eller binæring.
                    Registeret er delt i to blad:
                </BodyShort>
                <BodyShort spacing>
                    Blad B er for deg som har fiske som hovednæring. Blad A er for deg som har fiske som binæring ved
                    siden av en annen jobb.
                </BodyShort>
                <BodyShort spacing>
                    Er du usikker på om du er registrert, eller hvilket blad du står på? Du kan sjekke på
                    Fiskerregisteret.
                </BodyShort>
            </ReadMore>
            <QuestionWrapper className={'mt-6'}>
                <RadioGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.fisker.velgBlad}
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
        </SectionWrapper>
    )
}

export default BladField
