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
            <BodyShort spacing>
                Svar nei på dette spørsmålet hvis du ikke har gitt beskjed til Nav, også selvom du var syk og borte fra
                jobb før du ble sykmeldt.
            </BodyShort>
        </ReadMore>
    )
}

export default HarBruktEgenmeldingsPerioderField
