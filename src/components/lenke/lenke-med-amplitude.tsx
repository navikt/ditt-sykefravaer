import { Link } from '@navikt/ds-react'
import React from 'react'

import { logEvent } from '../amplitude/amplitude'

interface LenkeMedAmplitudeProps {
    tekst: string
    url: string
    cleanUrl?: string
}

export const LenkeMedAmplitude = ({ tekst, url, cleanUrl }: LenkeMedAmplitudeProps) => (
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
