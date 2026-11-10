import React, { ReactElement } from 'react'
import { BodyShort, ReadMore } from '@navikt/ds-react'
import { RadioCard, RadioCardGroup } from '@navikt/ds-react/PREVIEW'
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
        <SectionWrapper title={sporsmal.fisker.velgBlad} size={'small'}>
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
                <RadioCardGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.fisker.velgBlad}
                    hideLegend
                    error={fieldState.error?.message}
                >
                    {bladtyper.map((blad) => {
                        const beskrivelse = bladbeskrivelse(blad)
                        return (
                            <RadioCard key={blad} value={blad} description={beskrivelse}>
                                {bladTittel(blad)}
                            </RadioCard>
                        )
                    })}
                </RadioCardGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}

export default BladField
