import React from 'react'

import { Redirect } from '../components/redirect/redirect'
import { sykmeldingUrl } from '../utils/environment'

export const RedirectSykmeldinger = () => {
    return <Redirect addresse={`${sykmeldingUrl()}`} />
}

export default RedirectSykmeldinger
