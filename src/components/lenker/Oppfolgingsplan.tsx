import React from 'react'
import { HandshakeIcon } from '@navikt/aksel-icons'

import { oppfolgingsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'
const Oppfolgingsplan = () => {
    return (
        <FellesLenkepanel
            ikon={HandshakeIcon}
            url={oppfolgingsplanUrl()}
            tekst={tekst('lenker.oppfolgingsplan')}
            undertekst={tekst('lenker.oppfolgingsplan.undertekst')}
        />
    )
}

export default Oppfolgingsplan
