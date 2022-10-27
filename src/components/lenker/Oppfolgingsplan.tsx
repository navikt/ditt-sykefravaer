import React from 'react'

import { oppfolgingsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const Oppfolgingsplan = () => {
    const ikon = <img src="/syk/sykefravaer/static/shakeHands.svg" alt="Oppfolgingsplaner" />

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={oppfolgingsplanUrl()}
            tekst={tekst('lenker.oppfolgingsplan')}
            undertekst={tekst('lenker.oppfolgingsplan.undertekst')}
        />
    )
}

export default Oppfolgingsplan
