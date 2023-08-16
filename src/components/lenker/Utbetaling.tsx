import React from 'react'
import { CheckmarkCircleIcon } from '@navikt/aksel-icons'

import { spinnsynUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import useVedtak from '../../hooks/useVedtak'

import { FellesLenkepanel } from './FellesLenkepanel'

const UtbetalingAvSykepengerLenkepanel = () => {
    const { data: vedtak } = useVedtak()
    if (vedtak && vedtak.length > 0) {
        return (
            <FellesLenkepanel
                ikon={CheckmarkCircleIcon}
                url={spinnsynUrl()}
                tekst={tekst('lenker.utbetaling')}
                undertekst={tekst('lenker.utbetaling.undertekst')}
            />
        )
    }
    return null
}

export default UtbetalingAvSykepengerLenkepanel
