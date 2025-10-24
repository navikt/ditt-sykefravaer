import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'
import { Alert } from '@navikt/ds-react'

import { useShouldShowSummaryForFrilanser } from '../formProgressUtils'
import { FormValues } from '../../../SendSykmeldingForm'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import Spinner from '../../../../Spinner/Spinner'
import useErUtenforVentetid from '../../../../../hooks/useErUtenforVentetid'
import { YesOrNo } from '../../../../../types/sykmelding/sykmeldingCommon'

import HarBruktEgenmeldingsPerioderField from './HarBruktEgenmeldingsPerioderField'
import FrilanserEgenmeldingPerioderField from './FrilanserEgenmeldingPerioderField'
import HarForsikringField from './HarForsikringField'
import FrilanserOppsummeringSection from './FrilanserOppsummeringSection'

interface Props {
    sykmeldingId: string
    sykmeldingStartDato: string
}

function FrilanserSection({ sykmeldingId, sykmeldingStartDato }: Props): ReactElement | null {
    const { watch } = useFormContext<FormValues>()
    const harBruktEgenmelding = watch('harBruktEgenmelding')
    const { data, isPending: loading, error } = useErUtenforVentetid(sykmeldingId)

    const shouldShowSummaryForFrilanser = useShouldShowSummaryForFrilanser()
    if (loading) {
        return (
            <div className="mt-8 mb-24">
                <Spinner headline="Henter ekstra informasjon" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <Alert variant="error" role="alert" className="mt-4">
                Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen. Vennligst
                prøv igjen senere.
            </Alert>
        )
    }

    if (data.erUtenforVentetid) {
        return null
    }

    const oppfolgingsdato = data?.oppfolgingsdato || sykmeldingStartDato
    const formValues = watch()

    return (
        <SectionWrapper title="Fravær før sykmeldingen">
            <HarBruktEgenmeldingsPerioderField oppfolgingsdato={oppfolgingsdato} />
            {harBruktEgenmelding === YesOrNo.YES && (
                <FrilanserEgenmeldingPerioderField oppfolgingsdato={oppfolgingsdato} />
            )}
            <HarForsikringField />
            {shouldShowSummaryForFrilanser &&
                formValues.harForsikring !== null &&
                ((formValues.harBruktEgenmelding === YesOrNo.YES &&
                    formValues.egenmeldingsperioder?.every(
                        (periode) => periode.fom !== null && periode.tom !== null,
                    )) ||
                    formValues.harBruktEgenmelding === YesOrNo.NO) && (
                    <FrilanserOppsummeringSection
                        metadata={{
                            sykmeldingId: sykmeldingId,
                            arbeidsgiverNavn: null,
                            narmestelederNavn: null,
                            sykmeldingStartDato: sykmeldingStartDato,
                        }}
                        sykmeldingId={sykmeldingId}
                    />
                )}
        </SectionWrapper>
    )
}

export default FrilanserSection
