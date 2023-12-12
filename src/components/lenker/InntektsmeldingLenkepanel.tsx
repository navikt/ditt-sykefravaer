import React from 'react'
import { SackKronerIcon } from '@navikt/aksel-icons'

import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'

import { FellesLenkepanel } from './FellesLenkepanel'

export const InntektsmeldingLenkepanel = () => {
    const { data: inntektsmeldinger, isLoading } = useInntektsmeldinger()

    if (isLoading) {
        return null
    }
    if (inntektsmeldinger && inntektsmeldinger.length == 0) {
        return null
    }
    return (
        <FellesLenkepanel
            ikon={SackKronerIcon}
            tekst="Inntektsmeldinger"
            undertekst="Fra arbeidsgiveren din"
            url="/inntektsmeldinger"
        />
    )
}
