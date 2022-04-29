import React, { useEffect } from 'react'

import { sykepengesoknadUrl, sykmeldingUrl } from '../utils/environment'

interface RedirectProps {
    addresse: string
}

const SykepengesoknadUtland = (props: RedirectProps) => {

    useEffect(() => {
        window.location.href = props.addresse
    }, [ props.addresse ])

    return (
        <div>
            <h1>Du blir sendt videre...</h1>
            <p>
                <a href={props.addresse} className="lenke">Gå videre!</a>
            </p>
        </div>
    )
}

export const RedirectSykepengesoknadUtland = () => {
    return (<SykepengesoknadUtland addresse={`${sykepengesoknadUrl()}/sykepengesoknad-utland`} />)
}

export const RedirectSykmeldinger = () => {
    return (<SykepengesoknadUtland addresse={`${sykmeldingUrl()}`} />)
}

export default SykepengesoknadUtland
