import React, { ReactElement } from 'react'
import { BodyShort, ReadMore, Link } from '@navikt/ds-react'

import { sporsmal } from '../../../../../utils/sporsmal'
import YesNoField from '../../../../FormComponents/YesNoField/YesNoField'
import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'

interface Props {
    oppfolgingsdato: string
}

function SykFoerSykmeldingenField({ oppfolgingsdato }: Props): ReactElement {
    return (
        <QuestionWrapper>
            <YesNoField<FormValues>
                name="sykFoerSykmeldingen"
                legend={sporsmal.sykFoerSykmeldingen(oppfolgingsdato)}
                subtext={<SykFoerSykmeldingenReadMore />}
                rules={{
                    required: 'Du må svare på om du har vært syk og borte fra jobb før du ble sykmeldt.',
                }}
            />
        </QuestionWrapper>
    )
}

function SykFoerSykmeldingenReadMore(): ReactElement {
    return (
        <ReadMore header="Spørsmålet forklart">
            <BodyShort spacing>
                Du kan få sykepenger fra Nav fra dag 17. av sykefraværet. Derfor må vi vite når sykefraværet ditt
                startet.
            </BodyShort>
            <BodyShort spacing>
                <Link href="https://www.nav.no/sykepenger" target="_blank">
                    Les mer om sykepenger for selvstendig næringsdrivende
                </Link>
                .
            </BodyShort>
        </ReadMore>
    )
}

export default SykFoerSykmeldingenField
