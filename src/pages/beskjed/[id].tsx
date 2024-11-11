import { BodyLong, Box, Heading, ReadMore, Link, Skeleton, BodyShort } from '@navikt/ds-react'
import React from 'react'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Banner } from '../../components/banner/Banner'
import { Flexjar } from '../../components/flexjar/flexjar'
import useMeldinger from '../../hooks/useMeldinger'
import { formatterTall } from '../../utils/tall-utils'
import { getManedsNavn, capitalizeFirstLetter, formatDateFromString } from '../../utils/dato-utils'

const ForelagtInntektFraAareg = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: meldinger, isLoading: meldingerLaster } = useMeldinger()

    const melding = meldinger?.find((m) => m.uuid == id)

    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Opplysninger fra A-ordningen' }],
        [],
    )

    if (meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    const grouperMedAar = (inntekter: { maned: string; belop: number | null }[]) => {
        return inntekter.reduce(
            (acc, { maned, belop }) => {
                const [year, month] = maned.split('-')

                if (!acc[year]) {
                    acc[year] = []
                }

                acc[year].push({ month, belop })
                return acc
            },
            {} as Record<string, { month: string; belop: number | null }[]>,
        )
    }

    const groupedInntekter = melding?.metadata?.inntekter ? grouperMedAar(melding.metadata.inntekter) : {}
    console.log('melding', meldinger) // eslint-disable-line

    return (
        <>
            <Banner utenIkon={true} tittel="Vi har hentet opplysninger fra A-ordningen" />

            <BodyLong spacing>
                Vi har fortsatt ikke mottatt inntektsmelding fra {melding?.metadata?.orgnavn} og har derfor hentet
                opplysninger om inntekten din fra A-ordningen. Vi vil bruke opplysningene til å behandle saken din om
                sykepenger.
            </BodyLong>

            <ReadMore className="mt-4" header="Hva er A-ordningen?">
                A-ordningen er et offentlig register hvor arbeidsgivere sender inn opplysninger om sine ansatte. Nav
                bruker opplysninger fra dette registeret til å blant annet behandle søknader om sykepenger.
            </ReadMore>

            <Box padding="4" borderRadius="small" className="my-8 bg-gray-50">
                <Heading level="2" size="small" spacing>
                    Vi trenger at du sjekker om inntekten stemmer
                </Heading>

                <BodyLong spacing>
                    Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før du ble syk for å
                    beregne sykepengene dine. Hvis inntekten vi har hentet ikke stemmer med det du har tjent, må du gi
                    beskjed så vi kan ta det med i beregningen.
                </BodyLong>

                <BodyLong spacing>Hvis inntekten stemmer og alt ser greit ut, trenger du ikke gjøre noe.</BodyLong>

                <Heading level="2" size="xsmall" spacing>
                    Inntekt hentet fra A-ordningen
                </Heading>
                <div>
                    <div>
                        {Object.entries(groupedInntekter).map(([year, months]) => (
                            <div key={year} className="mb-5">
                                <div>{year}</div>
                                {months.map(({ month, belop }) => (
                                    <BodyShort key={`${year}-${month}`}>
                                        {capitalizeFirstLetter(getManedsNavn(month))}:{' '}
                                        {belop !== null ? `${formatterTall(belop)} kroner` : 'Ingen inntekt registrert'}
                                    </BodyShort>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <BodyShort className="italic">Inntekten vist er før skatt</BodyShort>
            </Box>

            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Ta kontakt hvis inntekten ikke stemmer
                </Heading>
                <BodyLong className="mt-4" spacing>
                    Hvis opplysningene vi har hentet er feil, ta kontakt på{' '}
                    <Link href="https://www.nav.no/kontaktoss#skriv-til-oss" target="_blank">
                        nav.no/kontaktoss
                    </Link>{' '}
                    innen 3 uker fra{' '}
                    {melding?.metadata?.tidsstempel ? `${formatDateFromString(melding.metadata.tidsstempel)}` : ''}. Har
                    du dokumentasjon som viser hva feilen er, kan du også sende oss det.
                </BodyLong>
            </Box>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default ForelagtInntektFraAareg
