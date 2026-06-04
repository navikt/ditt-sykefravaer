import { ReactElement } from 'react'
import { useController } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import { ArbeidssituasjonType } from '../../../../types/sykmelding/sykmeldingCommon'
import { FormValues } from '../../SendSykmeldingForm'
import { QuestionWrapper } from '../../../FormComponents/FormStructure'
import { arbeidssituasjonDescription, arbeidssituasjonLabel, sporsmal } from '../../../../utils/sporsmal'

import AnnetExtraSelect from './AnnetExtraSelect'

interface Props {
    harAvventendePeriode: boolean
}

const arbeidssituasjonerRekkefolge: ArbeidssituasjonType[] = [
    ArbeidssituasjonType.ARBEIDSTAKER,
    ArbeidssituasjonType.FISKER,
    ArbeidssituasjonType.JORDBRUKER,
    ArbeidssituasjonType.NAERINGSDRIVENDE,
    ArbeidssituasjonType.FRILANSER,
    ArbeidssituasjonType.ARBEIDSLEDIG,
    ArbeidssituasjonType.PERMITTERT,
    ArbeidssituasjonType.ANNET,
]

function ArbeidssituasjonField({ harAvventendePeriode }: Props): ReactElement {
    const { field, fieldState } = useController<FormValues>({
        name: 'arbeidssituasjon',
        rules: { required: 'Du må svare på hvilket arbeid du er sykmeldt fra.' },
    })

    return (
        <QuestionWrapper>
            <RadioGroup
                {...field}
                id={field.name}
                legend={sporsmal.arbeidssituasjon}
                hideLegend
                onChange={(value: ArbeidssituasjonType) => {
                    /*      logUmamiEvent({
                              eventName: 'skjema spørsmål besvart',
                              data: { skjemanavn: 'arbeidssituasjon', spørsmål: 'Jeg er sykmeldt som', svar: value },
                          })*/ //TODO skru på igjen
                    field.onChange(value)
                }}
                error={fieldState.error?.message}
            >
                {arbeidssituasjonerRekkefolge.map((situasjon) => {
                    const description = arbeidssituasjonDescription(situasjon)
                    return (
                        <Radio
                            key={situasjon}
                            disabled={harAvventendePeriode && situasjon !== ArbeidssituasjonType.ARBEIDSTAKER}
                            value={situasjon}
                            {...(description ? { description } : {})}
                        >
                            {arbeidssituasjonLabel(situasjon)}
                        </Radio>
                    )
                })}
            </RadioGroup>
            {field.value === ArbeidssituasjonType.ANNET && <AnnetExtraSelect />}
        </QuestionWrapper>
    )
}

export default ArbeidssituasjonField
