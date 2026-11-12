import React, { ReactElement } from 'react'
import { BodyShort, ReadMore } from '@navikt/ds-react'
import { RadioCard, RadioCardGroup } from '@navikt/ds-react/PREVIEW'
import { useController } from 'react-hook-form'

import { LottOgHyre } from '../../../../../types/sykmelding/sykmeldingCommon'
import { lottHyreBeskrivelse, lottOgHyreTittel, sporsmal } from '../../../../../utils/sporsmal'
import { QuestionWrapper, SectionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'

function LottOgHyreField(): ReactElement {
    const { field, fieldState } = useController<FormValues>({
        name: 'fisker.lottOgHyre',
        rules: { required: 'Du må svare på lott eller hyre spørsmål' },
    })

    const lottOgHyreSvar: LottOgHyre[] = [LottOgHyre.HYRE, LottOgHyre.LOTT, LottOgHyre.BEGGE]

    return (
        <SectionWrapper title={sporsmal.fisker.lottEllerHyre} size={'small'}>
            <ReadMore header="Hva betyr lott og hyre?">
                <BodyShort spacing>
                    Svar hyre hvis du får en fast lønn fra rederiet eller fartøyets eier, som en vanlig arbeidstaker.
                </BodyShort>
                <BodyShort spacing>
                    Svar lott hvis du får en andel av fangstinntekten som betaling - det vil si at lønna di avhenger av
                    hva som fanges.
                </BodyShort>
                <BodyShort spacing>Svar begge deler hvis du mottar både fast hyre og lott.</BodyShort>
            </ReadMore>
            <QuestionWrapper className={'mt-6'}>
                <RadioCardGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.fisker.lottEllerHyre}
                    hideLegend
                    error={fieldState.error?.message}
                >
                    {lottOgHyreSvar.map((lottOgHyre) => {
                        const beskrivelse = lottHyreBeskrivelse(lottOgHyre)
                        return (
                            <RadioCard key={lottOgHyre} value={lottOgHyre} description={beskrivelse}>
                                {lottOgHyreTittel(lottOgHyre)}
                            </RadioCard>
                        )
                    })}
                </RadioCardGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}

export default LottOgHyreField
