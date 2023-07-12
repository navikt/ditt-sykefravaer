import React from 'react'
import { CheckmarkCircleIcon } from '@navikt/aksel-icons'

import { spinnsynUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'
const UtbetalingAvSykepengerLenkepanel = () => {
    return (
        <FellesLenkepanel
            ikon={CheckmarkCircleIcon}
            url={spinnsynUrl()}
            tekst={tekst('lenker.utbetaling')}
            undertekst={tekst('lenker.utbetaling.undertekst')}
        />
    )
}

export default UtbetalingAvSykepengerLenkepanel
