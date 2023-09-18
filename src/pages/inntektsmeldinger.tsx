import React from 'react'
import { BodyShort, Heading, Label } from '@navikt/ds-react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { useInntektsmeldinger } from '../hooks/useInntektsmeldinger'

const Inntektsmeldinger = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Inntektsmeldinger' }],
        [],
    )
    const { data: inntektsmeldinger } = useInntektsmeldinger()

    return (
        <>
            <Banner tittel="Inntektsmeldinger" />
            {inntektsmeldinger?.map((inntektsmelding) => (
                <div key={inntektsmelding.inntektsmeldingId}>
                    <Heading level="2" size="medium" spacing>
                        {inntektsmelding.organisasjonsnavn}
                    </Heading>
                    <BodyShort spacing>{'Første fraværsdag: ' + inntektsmelding.foersteFravaersdag}</BodyShort>
                    <BodyShort spacing>{'Beregnet inntekt: ' + inntektsmelding.beregnetInntekt}</BodyShort>
                    <BodyShort spacing>{'Mottatt dato: ' + inntektsmelding.mottattDato}</BodyShort>
                </div>
            ))}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmeldinger
