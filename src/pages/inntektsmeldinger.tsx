import React from 'react'
import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import Link from 'next/link'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { useInntektsmeldinger } from '../hooks/useInntektsmeldinger'
import { formatDateFromString } from '../components/inntektsmelding/formatDate'

const Inntektsmeldinger = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Inntektsmeldinger' }],
        [],
    )
    const { data: inntektsmeldinger } = useInntektsmeldinger()
    return (
        <>
            <Heading size="large" level="1">
                Inntektsmeldinger
            </Heading>

            {inntektsmeldinger
                ?.sort((a, b) => b.mottattDato.localeCompare(a.mottattDato))
                ?.map((inntektsmelding) => (
                    <Link
                        href={`/inntektsmeldinger/${inntektsmelding.inntektsmeldingId}`}
                        key={inntektsmelding.inntektsmeldingId}
                    >
                        <LinkPanel className="mt-4">
                            <div>
                                <Heading size="small" level="2" spacing>
                                    {inntektsmelding.organisasjonsnavn}
                                </Heading>
                                <BodyShort>
                                    For sykefravær som startet{' '}
                                    {formatDateFromString(inntektsmelding.foersteFravaersdag)}
                                </BodyShort>
                                <BodyShort className="text-gray-600 italic">
                                    Mottatt: {formatDateFromString(inntektsmelding.mottattDato)}
                                </BodyShort>
                            </div>
                        </LinkPanel>
                    </Link>
                ))}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmeldinger
