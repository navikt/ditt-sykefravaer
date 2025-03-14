import { BodyLong, Box, Heading, Link, List, BodyShort } from '@navikt/ds-react'
import React from 'react'

import { tilLesbarDatoMedArstall } from '../../utils/dato-utils'
import { Flexjar } from '../flexjar/flexjar'
import { Banner } from '../banner/Banner'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Inntekt } from '../../pages/beskjed/[id]'
import { Melding } from '../../types/melding'
import TilHovedsiden from '../TilHovedsiden/TilHovedsiden'

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
                opplysninger om inntekten din fra a-ordningen. Vi vil bruke opplysningene til å behandle søknaden din og
                beregne hvor mye sykepenger du kan få.
            </BodyLong>

            <ForelagteInntektInfoBoks grupperteInntekter={grupperteInntekter} />

            <Heading level="2" size="medium" spacing>
                Vi trenger å vite om vi skal bruke inntekten fra a-ordningen
            </Heading>

            <BodyLong spacing>
                Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før den måneden du ble syk
                for å beregne hvor mye sykepenger du kan få. Hvis inntekten din har endret seg i løpet av denne
                perioden, kan det være andre regler for hvordan vi skal beregne. Da må du gi oss beskjed. Det kan for
                eksempel være hvis:
            </BodyLong>

            <List as="ul">
                <List.Item>
                    <BodyShort as="span" weight="semibold">
                        Du har fått ny jobb:
                    </BodyShort>{' '}
                    Da skal vi kun bruke den nye inntekten din
                </List.Item>
                <List.Item>
                    <BodyShort as="span" weight="semibold">
                        Du har gått opp eller ned i lønn:
                    </BodyShort>{' '}
                    Da skal vi bruke inntekten etter endringen skjedde
                </List.Item>
                <List.Item>
                    <BodyShort as="span" weight="semibold">
                        Du har hatt ferie, permisjon eller annet fravær:
                    </BodyShort>{' '}
                    Da skal vi bruke inntekten du ville hatt hvis du hadde vært på jobb
                </List.Item>
            </List>

            <BodyLong spacing>Har du inntekt fra overtid skal det som regel ikke tas med i beregningen.</BodyLong>

            <Box padding="6" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Ta kontakt hvis inntekten ikke stemmer
                </Heading>
                <BodyLong className="mt-4">
                    Har det vært endringer i situasjonen din som gjør at vi mangler opplysninger om inntekten din,{' '}
                    <Link href="https://innboks.nav.no/s/beskjed-til-oss?category=Endring-sykepenger" target="_blank">
                        gi beskjed til Nav om endringen
                    </Link>{' '}
                    innen{' '}
                    {melding?.metadata?.tidsstempel ? tilLesbarDatoMedArstall(melding.metadata.tidsstempel, 21) : ''}.
                </BodyLong>
                <BodyLong className="mt-4">
                    Hvis vi ikke hører fra deg innen{' '}
                    {melding?.metadata?.tidsstempel ? tilLesbarDatoMedArstall(melding.metadata.tidsstempel, 21) : ''},
                    vil vi bruke opplysningene fra a-ordningen til å behandle søknaden din.
                </BodyLong>
            </Box>

            <TilHovedsiden />

            <Flexjar feedbackId="forelegging-fra-a-ordningen" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}
