import { ReactElement } from 'react'
import { useController } from 'react-hook-form'
import { Alert } from '@navikt/ds-react'
import { RadioCard, RadioCardGroup } from '@navikt/ds-react/PREVIEW'

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
            <RadioCardGroup
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
                        <RadioCard
                            key={situasjon}
                            disabled={harAvventendePeriode && situasjon !== ArbeidssituasjonType.ARBEIDSTAKER}
                            value={situasjon}
                            description={description}
                        >
                            {arbeidssituasjonLabel(situasjon)}
                        </RadioCard>
                    )
                })}
            </RadioCardGroup>
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
