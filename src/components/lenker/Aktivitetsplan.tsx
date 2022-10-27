import React from 'react'

import { aktivitetsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const Aktivitetsplan = () => {
    const ikon = <img src="/syk/sykefravaer/static/dialog.svg" alt="Aktivitetsplan" />

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={aktivitetsplanUrl()}
            tekst={tekst('lenker.aktivitetsplan')}
            undertekst={tekst('lenker.aktivitetsplan.undertekst')}
        />
    )
}

export default Aktivitetsplan
