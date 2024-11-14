import { BodyLong, Box, Heading, Link, ReadMore } from '@navikt/ds-react'
import React from 'react'

import { tilLesbarDatoMedArstall } from '../../utils/dato-utils'
import { Flexjar } from '../flexjar/flexjar'
import { Banner } from '../banner/Banner'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Inntekt } from '../../pages/beskjed/[id]'
import { Melding } from '../../types/melding'

import { ForelagteInntektInfoBoks } from './forelagteInntektInfoBoks'

export const ForelagtInntektFraAordningen = ({ melding }: { melding: Melding }) => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Opplysninger fra a-ordningen' }],
        [],
    )

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
            <Banner utenIkon={true} tittel="Vi har hentet opplysninger fra a-ordningen" />

            <BodyLong spacing>
                Vi har fortsatt ikke mottatt inntektsmelding fra {melding?.metadata?.orgnavn} og har derfor hentet
                opplysninger om inntekten din fra a-ordningen. Vi vil bruke opplysningene til å behandle saken din om
                sykepenger.
            </BodyLong>

            <ReadMore className="mt-4" header="Hva er a-ordningen?">
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
                    innen{' '}
                    {melding?.metadata?.tidsstempel ? tilLesbarDatoMedArstall(melding.metadata.tidsstempel, 21) : ''}.
                    Har du dokumentasjon som viser hva feilen er, kan du også sende oss det.
                </BodyLong>
            </Box>

            <Flexjar feedbackId="forelegging-fra-a-ordningen" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}
