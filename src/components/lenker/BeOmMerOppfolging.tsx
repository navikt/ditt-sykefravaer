import React from 'react'
import { Chat2Icon } from '@navikt/aksel-icons'

import { meroppfolgingUrl } from '../../utils/environment'

import { FellesLenkepanel } from './FellesLenkepanel'

export const BeOmMerOppfolging = () => {
    return (
        <FellesLenkepanel
            ikon={Chat2Icon}
            url={meroppfolgingUrl()}
            tekst="Be om mer oppfølging"
            undertekst="Registreringsskjema for mer oppfølging og aktivitetsplan"
        />
    )
}
