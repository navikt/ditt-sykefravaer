import React, { ReactElement } from 'react'
import { BodyShort, Radio, RadioGroup, ReadMore, Box } from '@navikt/ds-react'
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
        <SectionWrapper title={'Hva slags lønn får du fra fisket?'} size={'small'}>
            <ReadMore header="Hva betyr lott og hyre?">
                <BodyShort spacing>
                    Svar hyre hvis du får en fast lønn fra rederiet eller fartøyets eier, som en vanlig arbeidstaker.
                </BodyShort>
                <BodyShort spacing>
                    Svar blad lott hvis du får en andel av fangstinntekten som betaling - det vil si at lønna di
                    avhenger av hva som fanges.
                </BodyShort>
                <BodyShort spacing>Svar begge deler hvis du mottar både fast hyre og lott.</BodyShort>
            </ReadMore>
            <QuestionWrapper className={'mt-6'}>
                <RadioGroup
                    {...field}
                    id={field.name}
                    legend={sporsmal.fisker.lottEllerHyre}
                    hideLegend
                    error={fieldState.error?.message}
                >
                    {lottOgHyreSvar.map((lottOgHyre) => {
                        const beskrivelse = lottHyreBeskrivelse(lottOgHyre)
                        return (
                            <Box
                                key={lottOgHyre}
                                paddingInline="space-8"
                                borderWidth="2"
                                borderRadius="12"
                                borderColor="neutral-subtle"
                                className="mb-2 focus-within:border-ax-border-accent focus-within:bg-ax-bg-accent-soft"
                            >
                                <Radio
                                    key={lottOgHyre}
                                    value={lottOgHyre}
                                    {...(beskrivelse ? { description: beskrivelse } : {})}
                                    className="w-full"
                                >
                                    <span className="font-medium">{lottOgHyreTittel(lottOgHyre)}</span>
                                </Radio>
                            </Box>
                        )
                    })}
                </RadioGroup>
            </QuestionWrapper>
        </SectionWrapper>
    )
}

export default LottOgHyreField
