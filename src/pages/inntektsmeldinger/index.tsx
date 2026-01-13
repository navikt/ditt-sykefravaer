import React from 'react'
import { BodyLong, BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
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
            {inntektsmeldinger
                ?.sort((a, b) => b.mottattDato.localeCompare(a.mottattDato))
                ?.map((inntektsmelding) => (
                    <LinkPanel
                        key={inntektsmelding.inntektsmeldingId}
                        href={`/inntektsmeldinger/${inntektsmelding.inntektsmeldingId}`}
                        as={Link}
                        className="mt-4"
                    >
                        <div>
                            <Heading size="small" level="2" spacing>
                                {inntektsmelding.organisasjonsnavn}
                            </Heading>
                            {inntektsmelding.foersteFravaersdag && (
                                <BodyShort spacing>
                                    For sykefravær som startet {toReadableDate(inntektsmelding.foersteFravaersdag)}
                                </BodyShort>
                            )}
                            <BodyShort className="text-gray-600">
                                Mottatt: {toReadableDate(inntektsmelding.mottattDato)}
                            </BodyShort>
                        </div>
                    </LinkPanel>
                ))}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default InntektsmeldingerPage
