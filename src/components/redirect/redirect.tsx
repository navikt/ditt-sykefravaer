import React, { useEffect } from 'react'

interface RedirectProps {
    addresse: string
}

export const Redirect = (props: RedirectProps) => {
    useEffect(() => {
        window.location.href = props.addresse
    }, [props.addresse])

    return (
        <div>
            <h1>Du blir sendt videre...</h1>
            <p>
                <a href={props.addresse} className="navds-link">
                    Gå videre!
                </a>
            </p>
        </div>
    )
}
