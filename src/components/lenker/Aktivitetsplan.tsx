import React from 'react'
import { Chat2Icon } from '@navikt/aksel-icons'

import { aktivitetsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const Aktivitetsplan = () => {
    return (
        <FellesLenkepanel
            ikon={Chat2Icon}
            url={aktivitetsplanUrl()}
            tekst={tekst('lenker.aktivitetsplan')}
            undertekst={tekst('lenker.aktivitetsplan.undertekst')}
        />
    )
}

export default Aktivitetsplan
