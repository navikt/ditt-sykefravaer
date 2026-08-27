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
import { useLockSubmit } from '../../../shared/LockSubmitContext'
import { onOrAfter } from '../../../../../../utils/dateUtils'
import { logger } from '@navikt/next-logger'

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

    const isLoading = forsteSykmeldingLoading || utenforVentetidLoading
    const hasError = forsteSykmeldingError || !forsteSykmeldingData || utenforVentetidError || !utenforVentetidData

    useLockSubmit('fisker-selvstendig-data', isLoading || !!hasError)

    if (isLoading) {
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

    if (hasError) {
        return (
            <Alert variant="error" role="alert" className="mt-4">
                Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen. Vennligst
                prøv igjen senere.
            </Alert>
        )
    }

    const sykmeldingStartDato = getSykmeldingStartDate(sykmelding.sykmeldingsperioder)
    const { erForsteSykmelding, tidligsteFom } = forsteSykmeldingData
    const tidligsteFomPaEllerEtterStartdato = tidligsteFom ? onOrAfter(tidligsteFom, sykmeldingStartDato) : false

    if (tidligsteFomPaEllerEtterStartdato) {
        logger.warn('FiskerSelvstendigSection Uventet dato: tidligsteFom er lik eller etter sykmeldingStartDato', {
            tidligsteFom,
            sykmeldingStartDato,
            sykmeldingId: sykmelding.id,
        })
    }

    const visMeldingTilNavDager = erForsteSykmelding && !tidligsteFomPaEllerEtterStartdato
    const { erUtenforVentetid } = utenforVentetidData

    if (!visMeldingTilNavDager && erUtenforVentetid) {
        return null
    }

    return (
        <SectionWrapper title="Fravær før sykmeldingen">
            {visMeldingTilNavDager && (
                <>
                    <SykFoerSykmeldingenField sykmeldingStartDato={sykmeldingStartDato} />
                    {sykFoerSykmeldingen === YesOrNo.YES && <HarBruktEgenmeldingsPerioderField />}
                    {sykFoerSykmeldingen === YesOrNo.YES && harBruktEgenmelding === YesOrNo.YES && (
                        <FrilanserEgenmeldingPerioderField
                            sykmeldingStartDato={sykmeldingStartDato}
                            tidligsteFom={tidligsteFom}
                        />
                    )}
                </>
            )}
            {!erUtenforVentetid && <HarForsikringField />}
        </SectionWrapper>
    )
}

export default FiskerSelvstendigSection
