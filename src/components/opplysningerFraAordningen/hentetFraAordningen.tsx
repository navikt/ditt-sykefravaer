import { Alert, BodyLong, BodyShort, Box, Button, Heading, ReadMore } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import React from 'react'

import { tilLesbarDatoMedArstall, tilLesbarDatoOgKlokkeslett } from '../../utils/dato-utils'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { Inntekt } from '../../pages/beskjed/[id]'
import { Melding } from '../../types/melding'

import { ForelagteInntektInfoBoks } from './forelagteInntektInfoBoks'

export const ForelagtInntektFraAordningen = ({ melding }: { melding: Melding }) => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.opplysningerFraAordningen())

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
    const fristDato = melding?.metadata?.tidsstempel ? tilLesbarDatoMedArstall(melding.metadata.tidsstempel, 21) : ''

    return (
        <>
            <Heading level="1" size="xlarge" spacing>
                Opplysninger om inntekten din
            </Heading>

            {melding?.metadata?.tidsstempel && (
                <BodyShort textColor="subtle" className="mb-6 italic">
                    Sendt fra Nav: {tilLesbarDatoOgKlokkeslett(melding.metadata.tidsstempel)}
                </BodyShort>
            )}

            <BodyLong spacing>
                Vi har hentet opplysninger om inntekten din. For å sikre at vi har riktige opplysninger, trenger vi at
                du sjekker at de stemmer.
            </BodyLong>

            <BodyLong spacing>
                Hvis opplysningene stemmer, trenger du ikke gjøre noe. Da vil vi bruke inntekten vi har hentet når vi
                skal behandle saken din om sykepenger.
            </BodyLong>

            <Alert variant="info" className="mb-6">
                <BodyLong>
                    Har du endringer til opplysningene, må du melde fra til Nav innen <strong>{fristDato}</strong>.
                    Eksempler på endringer kan være hvis du har byttet jobb, endret lønn, eller hatt ferie, permisjon
                    eller annet fravær.
                </BodyLong>
            </Alert>

            <ReadMore className="mb-6" header="Hvorfor vi har hentet opplysninger om inntekten din">
                <BodyLong>
                    Nav trenger opplysninger om inntekten din for å kunne beregne hvor mye sykepenger du kan få. Vi får
                    vanligvis opplysningene i en inntektsmelding fra arbeidsgiveren din. Vi har ikke mottatt
                    inntektsmelding fra arbeidsgiveren din, og har derfor hentet opplysninger fra a-ordningen
                    istedenfor.
                </BodyLong>
            </ReadMore>

            <Box as="hr" borderWidth="0 0 1 0" className="my-8" />

            <ForelagteInntektInfoBoks
                grupperteInntekter={grupperteInntekter}
                orgnavn={melding?.metadata?.orgnavn ?? ''}
            />

            <Box padding="6" borderRadius="small" background="surface-info-subtle" className="mt-8">
                <Heading level="2" size="small" spacing>
                    Meld fra til Nav om endringer
                </Heading>
                <BodyLong spacing>
                    Har du endringer til inntekten, må du gi beskjed til Nav <strong>innen {fristDato}</strong>.
                </BodyLong>
                <Button
                    as="a"
                    href="https://innboks.nav.no/s/beskjed-til-oss?category=Endring-sykepenger"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLinkIcon aria-hidden />}
                    iconPosition="right"
                >
                    Meld fra om endringer
                </Button>
            </Box>
        </>
    )
}
