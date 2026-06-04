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
                <Radio
                    value={ArbeidssituasjonType.ARBEIDSTAKER}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.ARBEIDSTAKER)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.ARBEIDSTAKER)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.FRILANSER}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.FRILANSER)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.FRILANSER)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.NAERINGSDRIVENDE}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.NAERINGSDRIVENDE)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.NAERINGSDRIVENDE)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.FISKER}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.FISKER)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.FISKER)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.JORDBRUKER}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.JORDBRUKER)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.JORDBRUKER)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.ARBEIDSLEDIG}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.ARBEIDSLEDIG)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.ARBEIDSLEDIG)}
                </Radio>
                <Radio
                    disabled={harAvventendePeriode}
                    value={ArbeidssituasjonType.PERMITTERT}
                    description={arbeidssituasjonDescription(ArbeidssituasjonType.PERMITTERT)}
                >
                    {arbeidssituasjonLabel(ArbeidssituasjonType.PERMITTERT)}
                </Radio>
                <Radio disabled={harAvventendePeriode} value={ArbeidssituasjonType.ANNET}>
                    {arbeidssituasjonLabel(ArbeidssituasjonType.ANNET)}
                </Radio>
            </RadioGroup>
            {field.value === ArbeidssituasjonType.ANNET && <AnnetExtraSelect />}
        </QuestionWrapper>
    )
}

export default ArbeidssituasjonField
