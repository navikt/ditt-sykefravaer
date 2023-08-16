import React from 'react'
import { TasklistIcon } from '@navikt/aksel-icons'
import { Skeleton } from '@navikt/ds-react'

import { sykepengesoknadUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import useSoknader from '../../hooks/useSoknader'

import { FellesLenkepanel } from './FellesLenkepanel'

const SoknadLenkepanel = () => {
    const { data: soknader, isLoading } = useSoknader()
    if (isLoading) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }
    if (soknader && soknader.length == 0) {
        return null
    }
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
