import React from 'react'
import { BandageIcon } from '@navikt/aksel-icons'

import { sykmeldingUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const SykmeldingLenkepanel = () => {
    return <FellesLenkepanel ikon={BandageIcon} url={sykmeldingUrl()} tekst={tekst('lenker.sykmelding')} />
}

export default SykmeldingLenkepanel
