import React, { ReactElement } from 'react'
import { Accordion, Alert } from '@navikt/ds-react'
import { logger } from '@navikt/next-logger'
import * as R from 'remeda'

import useFocusRefetch from '../../hooks/useFocusRefetch'
import SykmeldingLinkPanel from '../SykmeldingLinkPanel/SykmeldingLinkPanel'
import { InfoOmDigitalSykmelding, SerIkkeSykmelding } from '../InfoOmDigitalSykmelding/InfoOmDigitalSykmelding'
import { isActiveSykmelding, isUnderbehandling } from '../../utils/sykmeldingUtils'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { Sykmelding } from '../../types/sykmelding/sykmelding'

import { SykmeldingerListSkeleton } from './SykmeldingerSkeletons'

function SykmeldingerListAll(): ReactElement {
    const { data, isLoading, error, refetch } = useSykmeldinger()

    useFocusRefetch(refetch)

    if (data == null && isLoading) {
        return <SykmeldingerListSkeleton />
    }

    if (error) {
        return (
            <Alert variant="error" role="alert" aria-live="polite">
                Vi har problemer med baksystemene for øyeblikket.
            </Alert>
        )
    }
    if (data == null) {
        logger.error('Sykmeldinger is undefined')
        return (
            <Alert variant="error" role="alert" aria-live="polite">
                En uventet feil oppsto. Vennligst kontakt NAV dersom problemet vedvarer.
            </Alert>
        )
    }

    const { underBehandling, apenSykmeldinger, pastSykmeldinger } = filterSykmeldinger(data)

    return (
        <div>
            <SykmeldingLinkPanel title="Under behandling" type="UNDER_BEHANDLING" sykmeldinger={underBehandling} />
            <SykmeldingLinkPanel title="Nye sykmeldinger" type="NYE_SYKMELDINGER" sykmeldinger={apenSykmeldinger} />

            <Accordion>
                <InfoOmDigitalSykmelding />
                <SerIkkeSykmelding />
            </Accordion>

            <SykmeldingLinkPanel
                title="Tidligere sykmeldinger"
                type="TIDLIGERE_SYKMELDINGER"
                sykmeldinger={pastSykmeldinger}
            />
        </div>
    )
}

type SykmeldingSections = {
    apenSykmeldinger: Sykmelding[]
    pastSykmeldinger: Sykmelding[]
    underBehandling: Sykmelding[]
}

const groupByPredicate = (sykmelding: Sykmelding): keyof SykmeldingSections => {
    if (isUnderbehandling(sykmelding)) return 'underBehandling'
    else if (isActiveSykmelding(sykmelding)) return 'apenSykmeldinger'
    else return 'pastSykmeldinger'
}

function filterSykmeldinger(sykmeldinger: readonly Sykmelding[]): SykmeldingSections {
    const grouped: Partial<Record<keyof SykmeldingSections, Sykmelding[]>> = R.groupBy(sykmeldinger, (sykmelding) =>
        groupByPredicate(sykmelding),
    )

    return {
        apenSykmeldinger: grouped.apenSykmeldinger ?? [],
        pastSykmeldinger: grouped.pastSykmeldinger ?? [],
        underBehandling: grouped.underBehandling ?? [],
    }
}

export default SykmeldingerListAll
