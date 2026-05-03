import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'
import { Alert, Skeleton } from '@navikt/ds-react'

import { Sykmelding } from '../../../../../../types/sykmelding/sykmelding'
import HarBruktEgenmeldingsPerioderField from '../../Frilanser/HarBruktEgenmeldingsPerioderField'
import { SectionWrapper } from '../../../../../FormComponents/FormStructure'
import { FormValues } from '../../../../SendSykmeldingForm'
import HarForsikringField from '../../Frilanser/HarForsikringField'
import FrilanserEgenmeldingPerioderField from '../../Frilanser/FrilanserEgenmeldingPerioderField'
import { getSykmeldingStartDate } from '../../../../../../utils/sykmeldingUtils'
import { ArbeidssituasjonType, YesOrNo } from '../../../../../../types/sykmelding/sykmeldingCommon'
import SykFoerSykmeldingenField from '../../Frilanser/SykFoerSykmeldingenField'
import useErForsteSykmelding from '../../../../../../hooks/sykmelding/useErForsteSykmelding'
import useErUtenforVentetid from '../../../../../../hooks/sykmelding/useErUtenforVentetid'

interface Props {
    sykmelding: Sykmelding
}

function FiskerSelvstendigSection({ sykmelding }: Props): ReactElement | null {
    const { watch } = useFormContext<FormValues>()
    const [harBruktEgenmelding, sykFoerSykmeldingen] = watch(['harBruktEgenmelding', 'sykFoerSykmeldingen'])

    const {
        data: forsteSykmeldingData,
        isPending: forsteSykmeldingLoading,
        error: forsteSykmeldingError,
    } = useErForsteSykmelding(sykmelding.id, ArbeidssituasjonType.FISKER)
    const {
        data: utenforVentetidData,
        isPending: utenforVentetidLoading,
        error: utenforVentetidError,
    } = useErUtenforVentetid(sykmelding.id)

    if (forsteSykmeldingLoading || utenforVentetidLoading) {
        return (
            <SectionWrapper title="Fravær før sykmeldingen">
                <Skeleton className="mt-12" />
                <Skeleton />
                <Skeleton className="mt-4" width="40%" />
                <Skeleton variant="rounded" height={32} width="20%" className="mt-4" />
                <Skeleton variant="rounded" height={32} width="20%" className="mt-4" />
            </SectionWrapper>
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
    const sykmeldingStartDato = getSykmeldingStartDate(sykmelding.sykmeldingsperioder)

    return (
        <SectionWrapper title="Fravær før sykmeldingen">
            {erForsteSykmelding && (
                <>
                    <SykFoerSykmeldingenField sykmeldingStartDato={sykmeldingStartDato} />
                    {sykFoerSykmeldingen === YesOrNo.YES && <HarBruktEgenmeldingsPerioderField />}
                    {sykFoerSykmeldingen === YesOrNo.YES && harBruktEgenmelding === YesOrNo.YES && (
                        <FrilanserEgenmeldingPerioderField sykmeldingStartDato={sykmeldingStartDato} />
                    )}
                </>
            )}
            {!erUtenforVentetid && <HarForsikringField />}
        </SectionWrapper>
    )
}

export default FiskerSelvstendigSection
