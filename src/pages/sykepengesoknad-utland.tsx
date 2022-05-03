import React from 'react'

import { Redirect } from '../components/redirect/redirect'
import { sykepengesoknadUrl } from '../utils/environment'

const RedirectSykepengesoknadUtland = () => {
    return (
        <Redirect addresse={`${sykepengesoknadUrl()}/sykepengesoknad-utland`} />
    )
}

export default RedirectSykepengesoknadUtland
