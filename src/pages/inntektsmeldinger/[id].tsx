import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { useRouter } from 'next/router'

import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'
import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'

const Inntektsmeldinger = () => {
    const { data: inntektsmeldinger } = useInntektsmeldinger()
    const router = useRouter()
    const { id: inntektsmeldingId } = router.query as { id?: string }
    const inntektsmelding = inntektsmeldinger?.find(
        (inntektsmelding) => inntektsmelding.inntektsmeldingId === inntektsmeldingId,
    )
    useUpdateBreadcrumbs(
        () => [
            {
                title: 'Ditt sykefravær',
                url: '/',
                handleInApp: true,
            },
            {
                title: 'Inntektsmeldinger',
                url: '/inntektsmeldinger',
                handleInApp: true,
            },
            { title: inntektsmelding?.organisasjonsnavn || '...' },
        ],
        [inntektsmelding?.organisasjonsnavn],
    )

    return (
        <>
            <Heading level="1" size="large" spacing>
                {inntektsmelding?.organisasjonsnavn}
            </Heading>
            <Alert variant="info" className="mb-4">
                Hvis du finner feil i denne informasjonen, kontakt din arbeidsgiver slik at de kan sende en ny
                inntektsmelding
            </Alert>
            <BodyShort spacing>{'Første fraværsdag: ' + inntektsmelding?.foersteFravaersdag}</BodyShort>
            <BodyShort spacing>{'Beregnet inntekt: ' + inntektsmelding?.beregnetInntekt}</BodyShort>
            <BodyShort spacing>{'Mottatt dato: ' + inntektsmelding?.mottattDato}</BodyShort>
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmeldinger
