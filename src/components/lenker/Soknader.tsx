import React from 'react'

import { sykepengesoknadUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const SoknadLenkepanel = () => {
    const ikon = <img src="/syk/sykefravaer/static/task.svg" alt="Soknader" />

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={sykepengesoknadUrl()}
            tekst={tekst('lenker.soknader')}
            undertekst={tekst('lenker.soknader.undertekst')}
        />
    )
}

export default SoknadLenkepanel
