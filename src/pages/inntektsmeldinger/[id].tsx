import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { useRouter } from 'next/router'

import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'
import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { Feedback } from '../../components/feedback/feedback'
import { InntektsmeldingVisning } from '../../components/inntektsmelding/InntektsmeldingVisning'

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

    return <InntektsmeldingVisning inntektsmelding={inntektsmelding} />
}

function Skillelinje() {
    return <div className="border-t border-gray-300 my-4" />
}
function Heading2(props: { children: React.ReactNode }) {
    return (
        <Heading level="2" size="medium" spacing className="mt-4">
            {props.children}
        </Heading>
    )
}

function Heading3(props: { children: React.ReactNode }) {
    return (
        <Heading level="3" size="small" spacing className="mt-4">
            {props.children}
        </Heading>
    )
}
export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmeldinger
