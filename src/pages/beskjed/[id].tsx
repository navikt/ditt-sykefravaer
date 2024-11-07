import { BodyLong, Box, Heading, ReadMore, Link, Skeleton, BodyShort } from '@navikt/ds-react'
import React from 'react'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Banner } from '../../components/banner/Banner'
import { Flexjar } from '../../components/flexjar/flexjar'
import useMeldinger from '../../hooks/useMeldinger'
import { formatterTall } from '../../utils/tall-utils'

const ForelagtInntektFraAareg = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: meldinger, isLoading: meldingerLaster } = useMeldinger()

    const melding = meldinger?.find((m) => m.uuid == id)

    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Venter på Inntektsmelding' }],
        [],
    )

    if (meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    return (
        <>
            <Banner utenIkon={true} tittel="Vi har hentet opplysninger fra A-ordningen" />

            <BodyLong spacing>
                Vi har fortsatt ikke mottatt inntektsmelding fra {melding?.metadata?.orgnavn} og har derfor hentet
                opplysninger om inntekten din fra A-ordningen. Vi vil bruke opplysningene til å behandle saken din om
                sykepenger.
            </BodyLong>

            <ReadMore className="mt-4" header="Hva er A-ordningen?">
                Arbeidsgivere sender inn opplysninger om sine ansatte til et register som heter A-ordningen. Nav bruker
                opplysninger fra dette registeret til å blant annet behandle søknader om sykepenger.
            </ReadMore>

            <Heading level="2" size="small" className="mt-8">
                Vi trenger at du sjekker om inntekten stemmer
            </Heading>

            <BodyLong spacing>
                Det kan være tilfeller hvor du har hatt høyere eller lavere inntekt enn det som er registrert, for
                eksempel hvis du har tatt ut ferie, fått en ny stilling eller byttet jobb. Da trenger vi at du gir oss
                beskjed om det.
            </BodyLong>

            <Box padding="4" borderRadius="small" className="my-8 bg-gray-50">
                <Heading level="2" size="small" spacing>
                    Inntekt hentet fra Aa-registeret
                </Heading>
                <div>
                    {melding?.metadata?.inntekter.map((inntekt: { maned: string; belop: number }) => (
                        <BodyShort key={inntekt.maned}>
                            <strong>{inntekt.maned}</strong>: {`${formatterTall(inntekt.belop)} kroner`}
                        </BodyShort>
                    ))}
                </div>
            </Box>

            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Ta kontakt hvis inntekten ikke stemmer
                </Heading>
                <BodyLong className="mt-4" spacing>
                    Hvis opplysningene er feil, må du gi beskjed på{' '}
                    <Link href="https://www.nav.no/kontaktoss" target="_blank">
                        nav.no/kontaktoss
                    </Link>
                    innen 3 uker fra {melding?.metadata?.tidsstempel}. Har du dokumentasjon som viser hva feilen er, kan
                    du også sende oss det.
                </BodyLong>
                <BodyLong>Hvis inntekten stemmer, trenger du ikke gjøre noe.</BodyLong>
            </Box>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default ForelagtInntektFraAareg
