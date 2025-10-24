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
import useErUtenforVentetid from '../../../../../../hooks/useErUtenforVentetid'
import { YesOrNo } from '../../../../../../types/sykmelding/sykmeldingCommon'

interface Props {
    sykmelding: Sykmelding
    askForsikring: boolean
}

function FiskerSelvstendigSection({ sykmelding, askForsikring }: Props): ReactElement {
    const { watch } = useFormContext<FormValues>()
    const harBruktEgenmelding = watch('harBruktEgenmelding')
    const { data, isPending: loading, error } = useErUtenforVentetid(sykmelding.id)

    if (loading) {
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

    if (error || !data) {
        return (
            <Alert variant="error" role="alert" className="mt-4">
                Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen. Vennligst
                prøv igjen senere.
            </Alert>
        )
    }

    const oppfolgingsdato = data.oppfolgingsdato || getSykmeldingStartDate(sykmelding.sykmeldingsperioder)

    return (
        <SectionWrapper title="Fravær før sykmeldingen">
            <HarBruktEgenmeldingsPerioderField oppfolgingsdato={oppfolgingsdato} />
            {harBruktEgenmelding === YesOrNo.YES && (
                <FrilanserEgenmeldingPerioderField oppfolgingsdato={oppfolgingsdato} />
            )}
            {harBruktEgenmelding != null && askForsikring && <HarForsikringField />}
        </SectionWrapper>
    )
}

export default FiskerSelvstendigSection
