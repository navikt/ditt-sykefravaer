import Lenkepanel from 'nav-frontend-lenkepanel'
import React from 'react'

import environment from '../../utils/environment'

const SykmeldingLenkepanel = () => {
    return (

        <Lenkepanel href={environment.sykmeldingUrl} tittelProps={'undertittel'} border={true}>
            Sykmeldinger
        </Lenkepanel>

    )
}

export default SykmeldingLenkepanel
