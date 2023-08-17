import React from 'react'
import { BandageIcon } from '@navikt/aksel-icons'
import { Skeleton } from '@navikt/ds-react'

import { sykmeldingUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import useSykmeldinger from '../../hooks/useSykmeldinger'

import { FellesLenkepanel } from './FellesLenkepanel'

const SykmeldingLenkepanel = () => {
    const { data: sykmeldinger, isLoading } = useSykmeldinger()
    if (isLoading) return <Skeleton variant="rectangle" height="64px" className="mb-2" />
    if (!sykmeldinger || sykmeldinger.length === 0) {
        return null
    }
    return <FellesLenkepanel ikon={BandageIcon} url={sykmeldingUrl()} tekst={tekst('lenker.sykmelding')} />
}

export default SykmeldingLenkepanel
