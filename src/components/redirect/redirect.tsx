import { Heading, Link } from '@navikt/ds-react'
import React, { useEffect } from 'react'

export const Redirect = ({ addresse }: { addresse: string }) => {
    useEffect(() => {
        window.location.href = addresse
    }, [addresse])

    return (
        <>
            <Heading size="large" level="1">
                Du blir sendt videre...
            </Heading>
            <Link className="pt-4" href={addresse}>
                Gå videre!
            </Link>
        </>
    )
}
