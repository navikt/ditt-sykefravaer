import React from 'react'
import { Chat2Icon } from '@navikt/aksel-icons'

import { aktivitetsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import useArbeidsrettetOppfolging from '../../hooks/useArbeidsrettetOppfolging'

import { FellesLenkepanel } from './FellesLenkepanel'

const Aktivitetsplan = () => {
    const { data: arbeidsrettetOppfolging } = useArbeidsrettetOppfolging()
    if (arbeidsrettetOppfolging?.erUnderOppfolging) {
        return (
            <FellesLenkepanel
                ikon={Chat2Icon}
                url={aktivitetsplanUrl()}
                tekst={tekst('lenker.aktivitetsplan')}
                undertekst={tekst('lenker.aktivitetsplan.undertekst')}
            />
        )
    }
    return null
}

export default Aktivitetsplan
