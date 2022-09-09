import React from 'react'

import { sykmeldingUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { FellesLenkepanel } from './FellesLenkepanel'

const SykmeldingLenkepanel = () => {
    const ikon = <img src="/syk/sykefravaer/static/bandage.svg" alt="SykmeldingLenke" />

    return <FellesLenkepanel ikon={ikon} url={sykmeldingUrl()} tekst={tekst('lenker.sykmelding')} />
}

export default SykmeldingLenkepanel
