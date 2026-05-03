import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'
import { Alert } from '@navikt/ds-react'

import { useShouldShowSummaryForFrilanser } from '../formProgressUtils'
import { FormValues } from '../../../SendSykmeldingForm'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import Spinner from '../../../../Spinner/Spinner'
import useErForsteSykmelding from '../../../../../hooks/sykmelding/useErForsteSykmelding'
import useErUtenforVentetid from '../../../../../hooks/sykmelding/useErUtenforVentetid'
import { ArbeidssituasjonType, YesOrNo } from '../../../../../types/sykmelding/sykmeldingCommon'

import HarBruktEgenmeldingsPerioderField from './HarBruktEgenmeldingsPerioderField'
import FrilanserEgenmeldingPerioderField from './FrilanserEgenmeldingPerioderField'
import HarForsikringField from './HarForsikringField'
import FrilanserOppsummeringSection from './FrilanserOppsummeringSection'
import SykFoerSykmeldingenField from './SykFoerSykmeldingenField'

interface Props {
    sykmeldingId: string
    sykmeldingStartDato: string
    arbeidssituasjon: ArbeidssituasjonType
}

function FrilanserSection({ sykmeldingId, sykmeldingStartDato, arbeidssituasjon }: Props): ReactElement | null {
    const { watch } = useFormContext<FormValues>()
    const [harBruktEgenmelding, sykFoerSykmeldingen, harForsikring, egenmeldingsperioder] = watch([
        'harBruktEgenmelding',
        'sykFoerSykmeldingen',
        'harForsikring',
        'egenmeldingsperioder',
    ])

    const {
        data: forsteSykmeldingData,
        isPending: forsteSykmeldingLoading,
        error: forsteSykmeldingError,
    } = useErForsteSykmelding(sykmeldingId, arbeidssituasjon)
    const {
        data: utenforVentetidData,
        isPending: utenforVentetidLoading,
        error: utenforVentetidError,
    } = useErUtenforVentetid(sykmeldingId)

    const shouldShowSummaryForFrilanser = useShouldShowSummaryForFrilanser()

    if (forsteSykmeldingLoading || utenforVentetidLoading) {
        return (
            <div className="mt-8 mb-24">
                <Spinner headline="Henter ekstra informasjon" />
            </div>
        )
    }

    if (forsteSykmeldingError || !forsteSykmeldingData || utenforVentetidError || !utenforVentetidData) {
        return (
            <Alert variant="error" role="alert" className="mt-4">
                Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen. Vennligst
                prøv igjen senere.
            </Alert>
        )
    }

    const { erForsteSykmelding } = forsteSykmeldingData
    const { erUtenforVentetid } = utenforVentetidData

    const erSykFoerSykmeldingen = sykFoerSykmeldingen === YesOrNo.YES

    const egenmeldingsperioderBesvart =
        egenmeldingsperioder?.every((periode) => periode.fom !== null && periode.tom !== null) ?? false

    const sykFoerSykmeldingenSeksjonBesvart =
        sykFoerSykmeldingen === YesOrNo.NO ||
        (erSykFoerSykmeldingen &&
            (harBruktEgenmelding === YesOrNo.NO ||
                (harBruktEgenmelding === YesOrNo.YES && egenmeldingsperioderBesvart)))

    const forsteSykmeldingSeksjonBesvart = !erForsteSykmelding || sykFoerSykmeldingenSeksjonBesvart
    const forsikringSeksjonBesvart = erUtenforVentetid || harForsikring !== null

    return (
        <SectionWrapper title="Fravær før sykmeldingen">
            {erForsteSykmelding && (
                <>
                    <SykFoerSykmeldingenField sykmeldingStartDato={sykmeldingStartDato} />
                    {erSykFoerSykmeldingen && <HarBruktEgenmeldingsPerioderField />}
                    {erSykFoerSykmeldingen && harBruktEgenmelding === YesOrNo.YES && (
                        <FrilanserEgenmeldingPerioderField sykmeldingStartDato={sykmeldingStartDato} />
                    )}
                </>
            )}
            {!erUtenforVentetid && <HarForsikringField />}
            {shouldShowSummaryForFrilanser && forsteSykmeldingSeksjonBesvart && forsikringSeksjonBesvart && (
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
