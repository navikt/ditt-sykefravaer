import { Link } from '@navikt/ds-react'
import React from 'react'

import { logEvent } from '../umami/umami'

interface LenkeMedUmamiProps {
    tekst: string
    url: string
    cleanUrl?: string
}

export const LenkeMedUmami = ({ tekst, url, cleanUrl }: LenkeMedUmamiProps) => (
    <Link
        href={url}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() =>
            logEvent('navigere', {
                destinasjon: cleanUrl ?? url,
                skjemanavn: 'vedtak',
                lenketekst: tekst,
            })
        }
    >
        {tekst}
    </Link>
)
