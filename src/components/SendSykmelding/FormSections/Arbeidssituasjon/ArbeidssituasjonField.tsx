import { ReactElement } from 'react'
import { useController } from 'react-hook-form'
import { Alert, Box, Radio, RadioGroup } from '@navikt/ds-react'

import { ArbeidssituasjonType } from '../../../../types/sykmelding/sykmeldingCommon'
import { FormValues } from '../../SendSykmeldingForm'
import { QuestionWrapper } from '../../../FormComponents/FormStructure'
import { arbeidssituasjonDescription, arbeidssituasjonLabel, sporsmal } from '../../../../utils/sporsmal'

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
                        <Box
                            key={situasjon}
                            paddingInline="space-8"
                            borderWidth="2"
                            borderRadius="12"
                            borderColor="border-subtle"
                            className="mb-2 focus-within:border-border-selected focus-within:bg-surface-action-subtle"
                        >
                            <Radio
                                key={situasjon}
                                disabled={harAvventendePeriode && situasjon !== ArbeidssituasjonType.ARBEIDSTAKER}
                                value={situasjon}
                                {...(description ? { description } : {})}
                                className="w-full"
                            >
                                <span className="font-medium">{arbeidssituasjonLabel(situasjon)}</span>
                            </Radio>
                        </Box>
                    )
                })}
            </RadioGroup>
            {field.value === ArbeidssituasjonType.ANNET && (
                <Alert variant="info">
                    Sykmeldingen gjelder arbeidet du er sykmeldt fra. Velg den kategorien som beskriver hvordan du
                    jobber — eller jobbet da du ble sykmeldt. Er du usikker? Se «Finner du ikke din situasjon?» for
                    hjelp.
                </Alert>
            )}
        </QuestionWrapper>
    )
}

export default ArbeidssituasjonField
