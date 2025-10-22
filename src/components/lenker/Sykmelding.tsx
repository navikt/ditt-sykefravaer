import React from 'react'
import { BandageIcon } from '@navikt/aksel-icons'
import { Skeleton } from '@navikt/ds-react'

import { tekst } from '../../utils/tekster'
import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'

import { FellesLenkepanel } from './FellesLenkepanel'

const SykmeldingLenkepanel = () => {
    const { data: sykmeldinger, isLoading } = useTsmSykmeldinger()
    if (isLoading) return <Skeleton variant="rectangle" height="64px" className="mb-2" />
    if (!sykmeldinger || sykmeldinger.length === 0) {
        return null
    }
    return <FellesLenkepanel ikon={BandageIcon} url="/sykmeldinger" tekst={tekst('lenker.sykmelding')} />
}

export default SykmeldingLenkepanel
