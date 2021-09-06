import React, { useEffect } from 'react'

import env from '../../utils/environment'

const redirectPath = env.sykepengesoknadUrl + '/sykepengesoknad-utland'

export const SykepengesoknadUtland = () => {


    useEffect(() => {
        window.location.href = redirectPath
    }, [])

    return (
        <div>
            <h1>Du blir sendt videre...</h1>
            <p>
                <a href={redirectPath} className="lenke">Gå videre!</a>
            </p>
        </div>
    )
}

