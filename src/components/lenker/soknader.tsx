import Lenkepanel from 'nav-frontend-lenkepanel'
import React from 'react'

import environment from '../../utils/environment'

const SoknadLenkepanel = () => {
    return (
        <>
            <Lenkepanel href={environment.sykepengesoknadUrl} tittelProps={'undertittel'}
                border={true}>Søknader</Lenkepanel>
        </>
    )
}

export default SoknadLenkepanel
