import { BodyLong, Box, Heading, ReadMore, Link, Skeleton } from '@navikt/ds-react'
import React from 'react'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Banner } from '../../components/banner/Banner'
import { Flexjar } from '../../components/flexjar/flexjar'
import useMeldinger from '../../hooks/useMeldinger'
import { formatDateFromString } from '../../utils/dato-utils'
import { ForelagteInntektInfoBoks } from '../../components/opplysningerFraAordningen/forelagteInntektInfoBoks'

export interface Inntekt {
    maned: string
    belop: number | null
}

const ForelagtInntektFraAareg = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: meldinger, isLoading: meldingerLaster } = useMeldinger()
    const melding = meldinger?.find((m) => m.uuid === id)

    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Opplysninger fra A-ordningen' }],
        [],
    )

    if (meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    const grupperInntekterEtterAarr = (inntekter: Inntekt[]): Record<string, Inntekt[]> => {
        return inntekter.reduce(
            (akkumulator, { maned, belop }) => {
                const [aar, manedNummer] = maned.split('-')
                const manedsInntekt = { maned: manedNummer, belop }

                akkumulator[aar] = akkumulator[aar] ?? []
                akkumulator[aar].push(manedsInntekt)

                return akkumulator
            },
            {} as Record<string, Inntekt[]>,
        )
    }

    const grupperteInntekter = melding?.metadata?.inntekter ? grupperInntekterEtterAarr(melding.metadata.inntekter) : {}

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

            <ForelagteInntektInfoBoks grupperteInntekter={grupperteInntekter} />

            <Box padding="6" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Ta kontakt hvis inntekten ikke stemmer
                </Heading>
                <BodyLong className="mt-4">
                    Hvis opplysningene vi har hentet er feil,{' '}
                    <Link href="https://www.nav.no/kontaktoss#skriv-til-oss" target="_blank">
                        ta kontakt med Nav
                    </Link>{' '}
                    innen 3 uker fra{' '}
                    {melding?.metadata?.tidsstempel ? formatDateFromString(melding.metadata.tidsstempel) : ''}. Har du
                    dokumentasjon som viser hva feilen er, kan du også sende oss det.
                </BodyLong>
            </Box>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default ForelagtInntektFraAareg
