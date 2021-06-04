import Lenkepanel from 'nav-frontend-lenkepanel'
import React from 'react'

import environment from '../../utils/environment'

const UtbetalingAvSykepengerLenkepanel = () => {
    return (

        <Lenkepanel href={environment.spinnsynUrl} tittelProps={'undertittel'} border={true}>
            Utbetaling av sykepenger
        </Lenkepanel>

    )
}

export default UtbetalingAvSykepengerLenkepanel
