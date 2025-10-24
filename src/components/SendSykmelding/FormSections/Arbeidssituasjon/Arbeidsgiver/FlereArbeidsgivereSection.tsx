import React, { ReactElement } from 'react'
import { Alert, BodyShort, Heading, Link as DsLink } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'

import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'
import { FormValues } from '../../../SendSykmeldingForm'
import Spinner from '../../../../Spinner/Spinner'
import { useShouldShowSeveralArbeidsgivereInfo } from '../formProgressUtils'
import { YesOrNo } from '../../../../../types/sykmelding/sykmeldingCommon'
import { Arbeidsgiver } from '../../../../../hooks/sykmelding/useBrukerinformasjonById'

import FlereArbeidsgivereField from './FlereArbeidsgivereField'
import FlereArbeidsgivereInfo from './FlereArbeidsgivereInfo'

interface Props {
    sykmelding: Sykmelding
    arbeidsgivere: Arbeidsgiver[]
}

function FlereArbeidsgivereSection({ sykmelding, arbeidsgivere }: Props): ReactElement | null {
    const { watch } = useFormContext<FormValues>()
    const erSykmeldtFraFlereArbeidsforhold: string | null = watch('erSykmeldtFraFlereArbeidsforhold')
    const { shouldAskForSeveralSykmeldinger, isLoading, error } = useShouldShowSeveralArbeidsgivereInfo(
        arbeidsgivere,
        sykmelding,
    )

    if (isLoading) return <Spinner headline="Laster informasjon..." />
    if (error) {
        return (
            <Alert className="mt-4" variant="error" role="alert">
                <Heading spacing size="small" level="3">
                    Det skjedde en feil ved lasting av informasjon.
                </Heading>
                <BodyShort spacing>
                    Dersom problemet vedvarer, kan du fortelle oss om feilen på{' '}
                    <DsLink
                        href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler"
                        target="_blank"
                    >
                        skjemaet for feil og mangler
                    </DsLink>
                    .
                </BodyShort>
            </Alert>
        )
    }
    if (!shouldAskForSeveralSykmeldinger) return null

    return (
        <div>
            <FlereArbeidsgivereField />
            {erSykmeldtFraFlereArbeidsforhold === YesOrNo.YES && <FlereArbeidsgivereInfo />}
        </div>
    )
}

export default FlereArbeidsgivereSection
