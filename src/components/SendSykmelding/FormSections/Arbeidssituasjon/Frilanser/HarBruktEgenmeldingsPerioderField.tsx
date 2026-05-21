import { ReactElement } from 'react'
import { BodyShort, ReadMore } from '@navikt/ds-react'

import { sporsmal } from '../../../../../utils/sporsmal'
import YesNoField from '../../../../FormComponents/YesNoField/YesNoField'
import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'

function HarBruktEgenmeldingsPerioderField(): ReactElement {
    return (
        <QuestionWrapper>
            <YesNoField<FormValues>
                name="harBruktEgenmelding"
                legend={sporsmal.harBruktEgenmelding()}
                description={<HarBruktEgenmeldingBeskrivelse />}
                subtext={<HarBruktEgenmeldingReadMore />}
                rules={{
                    required: 'Du må svare på om du har gitt beskjed til Nav da du ble syk.',
                }}
            />
        </QuestionWrapper>
    )
}

function HarBruktEgenmeldingReadMore(): ReactElement {
    return (
        <ReadMore header="Spørsmålet forklart">
            <BodyShort spacing>
                Hvis du ga beskjed til Nav da du ble syk og ikke kunne jobbe, starter de første 16 dagene i sykefraværet
                å telle fra datoen vi fikk beskjed.{' '}
            </BodyShort>
        </ReadMore>
    )
}

function HarBruktEgenmeldingBeskrivelse(): ReactElement {
    return (
        <>
            <BodyShort>For eksempel ved at du selv ringte eller skrev melding til Nav.</BodyShort>
            <BodyShort spacing>Var du syk og borte fra jobb uten å gi beskjed til Nav, svar nei.</BodyShort>
        </>
    )
}

export default HarBruktEgenmeldingsPerioderField
