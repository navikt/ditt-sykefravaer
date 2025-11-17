import { BodyLong, Box, Heading, ReadMore } from '@navikt/ds-react'
import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { breadcrumbBuilders, useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import { LenkeMedUmami } from '../components/lenke/lenke-med-umami'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.manglendeInntektsmelding())

    return (
        <>
            <Banner utenIkon={true} tittel="Vi venter på inntektsmelding fra arbeidsgiveren din" />

            <BodyLong spacing>
                Vi har bedt arbeidsgiveren din om å sende oss inntektsmelding, men ikke fått den enda. Nav trenger
                opplysninger fra inntektsmeldingen for å behandle søknaden din om sykepenger.
            </BodyLong>
            <Box padding="6" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small" spacing>
                    Hva kan du gjøre?
                </Heading>
                <BodyLong spacing>
                    For å få behandlet søknaden din raskere, kan du ta kontakt med arbeidsgiveren din og be dem om å
                    sende inntektsmeldingen til Nav så fort som mulig.
                </BodyLong>
                <Heading level="2" size="small" spacing>
                    Hva gjør Nav?
                </Heading>
                <BodyLong spacing>
                    Hvis vi ikke har fått inntektsmeldingen innen 3 måneder etter at du søkte om sykepenger, henter vi
                    opplysninger om inntekten din fra a-ordningen i stedet. Du vil få beskjed fra oss når vi eventuelt
                    gjør dette.
                </BodyLong>
                <ReadMore header="Hva er a-ordningen?" className="mb-2">
                    a-ordningen er et offentlig register hvor arbeidsgivere sender inn opplysninger om sine ansatte. Nav
                    bruker opplysninger fra dette registeret til å blant annet behandle søknader om sykepenger.
                </ReadMore>
            </Box>

            <Heading level="2" size="small" spacing>
                Hvor lang tid tar det å behandle søknaden?
            </Heading>

            <BodyLong spacing>
                <LenkeMedUmami
                    url="https://www.nav.no/saksbehandlingstider#sykepenger"
                    tekst="Sjekk oppdaterte saksbehandlingstider her."
                ></LenkeMedUmami>
            </BodyLong>

            <Heading level="2" size="small" spacing>
                Har du spørsmål?
            </Heading>
            <BodyLong>
                {'Hvis det er noe du lurer på, kan du '}
                <LenkeMedUmami
                    url="https://innboks.nav.no/s/skriv-til-oss?category=Helse"
                    tekst="ta kontakt med oss."
                ></LenkeMedUmami>
            </BodyLong>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
