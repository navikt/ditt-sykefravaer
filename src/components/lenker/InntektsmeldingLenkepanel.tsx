import React from 'react'
import { SackKronerIcon } from '@navikt/aksel-icons'
import { Skeleton } from '@navikt/ds-react'
import Link from 'next/link'

import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'
import { inntektsmeldingerEnabled } from '../../utils/environment'

import { FellesLenkepanel } from './FellesLenkepanel'

export const InntektsmeldingLenkepanel = () => {
    const { data: inntektsmeldinger, isLoading } = useInntektsmeldinger()
    if (!inntektsmeldingerEnabled()) {
        return null
    }
    if (isLoading) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }
    if (inntektsmeldinger && inntektsmeldinger.length == 0) {
        return null
    }
    return (
        <Link href="/inntektsmeldinger">
            <FellesLenkepanel ikon={SackKronerIcon} tekst="Inntektsmeldinger" undertekst="Fra arbeidsgiveren din" />
        </Link>
    )
}
