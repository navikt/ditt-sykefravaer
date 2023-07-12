import React from 'react'
import { TasklistIcon } from '@navikt/aksel-icons'

import { sykepengesoknadUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'
const SoknadLenkepanel = () => {
    return (
        <FellesLenkepanel
            ikon={TasklistIcon}
            url={sykepengesoknadUrl()}
            tekst={tekst('lenker.soknader')}
            undertekst={tekst('lenker.soknader.undertekst')}
        />
    )
}

export default SoknadLenkepanel
