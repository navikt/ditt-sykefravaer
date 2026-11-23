import React from 'react'
import { BodyLong, BodyShort, LinkCard } from '@navikt/ds-react'
import Link from 'next/link'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'
import { Banner } from '../../components/banner/Banner'
import { toReadableDate } from '../../utils/dateUtils'

const InntektsmeldingerPage = () => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.inntektsmeldinger())
    const { data: inntektsmeldinger } = useInntektsmeldinger()
    return (
        <>
            <Banner tittel="Inntektsmeldinger" utenIkon={true}></Banner>
            <BodyLong spacing>
                For å behandle søknaden trenger vi en inntektsmelding fra arbeidsgiveren din. Inntektsmeldingen
                inneholder blant annet opplysninger om inntekten din, når du var borte fra jobb og om arbeidsgiver
                betaler lønn mens du er syk. Nav bruker opplysningene til å beregne hvor mye sykepenger du kan få.
            </BodyLong>

            {inntektsmeldinger && inntektsmeldinger.length === 0 && (
                <BodyShort spacing className="mt-4">
                    Du har ingen inntektsmeldinger.
                </BodyShort>
            )}
            {inntektsmeldinger && inntektsmeldinger.length > 0 && (
                <ul className="mt-4 flex list-none flex-col gap-4 p-0">
                    {inntektsmeldinger
                        .sort((a, b) => b.mottattDato.localeCompare(a.mottattDato))
                        .map((inntektsmelding) => (
                            <li key={inntektsmelding.inntektsmeldingId}>
                                <LinkCard>
                                    <LinkCard.Title as="h2">
                                        <LinkCard.Anchor asChild>
                                            <Link href={`/inntektsmeldinger/${inntektsmelding.inntektsmeldingId}`}>
                                                {inntektsmelding.organisasjonsnavn}
                                            </Link>
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                    <LinkCard.Description>
                                        {inntektsmelding.foersteFravaersdag && (
                                            <span className="block">
                                                For sykefravær som startet{' '}
                                                {toReadableDate(inntektsmelding.foersteFravaersdag)}
                                            </span>
                                        )}
                                        <span className="block text-ax-neutral-700">
                                            Mottatt: {toReadableDate(inntektsmelding.mottattDato)}
                                        </span>
                                    </LinkCard.Description>
                                </LinkCard>
                            </li>
                        ))}
                </ul>
            )}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default InntektsmeldingerPage
