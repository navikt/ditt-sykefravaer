import React from 'react'
import { useRouter } from 'next/router'
import { Heading } from '@navikt/ds-react'

import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'
import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { InntektsmeldingVisning } from '../../components/inntektsmelding/InntektsmeldingVisning'

const Inntektsmeldinger = () => {
    const { data: inntektsmeldinger } = useInntektsmeldinger()
    const router = useRouter()
    const inntektsmeldingId = router.query.id as string | undefined

    const inntektsmelding = inntektsmeldinger?.find(
        (inntektsmelding) => inntektsmelding.inntektsmeldingId === inntektsmeldingId,
    )
    useUpdateBreadcrumbs(() =>
        breadcrumbBuilders.inntektsmelding(inntektsmeldingId || '', inntektsmelding?.organisasjonsnavn),
    )

    if (inntektsmeldinger && !inntektsmelding)
        return (
            <Heading size="medium" level="1">
                Fant ikke inntektsmelding
            </Heading>
        )

    return <InntektsmeldingVisning inntektsmelding={inntektsmelding} />
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmeldinger
