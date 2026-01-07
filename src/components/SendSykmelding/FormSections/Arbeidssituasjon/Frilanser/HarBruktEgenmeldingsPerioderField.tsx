import { ReactElement } from 'react'
import { BodyShort } from '@navikt/ds-react'

import { sporsmal } from '../../../../../utils/sporsmal'
import YesNoField from '../../../../FormComponents/YesNoField/YesNoField'
import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'
import { toReadableDate } from '../../../../../utils/dato-utils'

interface Props {
    oppfolgingsdato: string
}

function HarBruktEgenmeldingsPerioderField({ oppfolgingsdato }: Props): ReactElement {
    return (
        <QuestionWrapper>
            <YesNoField<FormValues>
                name="harBruktEgenmelding"
                legend={sporsmal.harBruktEgenmelding(oppfolgingsdato)}
                subtext={<HarBruktEgenmeldingReadMore oppfolgingsdato={oppfolgingsdato} />}
                rules={{
                    required: 'Du må svare på om du har brukt egenmelding eller annen sykmelding før du ble syk.',
                }}
            />
        </QuestionWrapper>
    )
}

function HarBruktEgenmeldingReadMore({ oppfolgingsdato }: Props): ReactElement {
    return (
        <BodyShort>
            Spørsmålet gjelder kun hvis du var syk og borte fra jobb før {toReadableDate(oppfolgingsdato)}.
        </BodyShort>
    )
}

export default HarBruktEgenmeldingsPerioderField
