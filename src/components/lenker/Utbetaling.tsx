import React from 'react'

import { spinnsynUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

const UtbetalingAvSykepengerLenkepanel = () => {
    const ikon = <img className="max-w-none" src="/syk/sykefravaer/static/success.svg" alt="Svar" />

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={spinnsynUrl()}
            tekst={tekst('lenker.utbetaling')}
            undertekst={tekst('lenker.utbetaling.undertekst')}
        />
    )
}

export default UtbetalingAvSykepengerLenkepanel
