import { BodyLong, Box, Heading } from '@navikt/ds-react'
import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import { LenkeMedAmplitude } from '../components/lenke/lenke-med-amplitude'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Venter på inntektsmelding' }],
        [],
    )

    return (
        <>
            <Banner utenIkon={true} tittel="Vi venter på inntektsmelding fra arbeidsgiver" />

            <BodyLong spacing>
                Vi har ikke fått inntektsmelding fra arbeidsgiveren din. Nav trenger opplysninger fra inntektsmeldingen
                for å behandle søknaden din om sykepenger.
            </BodyLong>
            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
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
                <BodyLong>
                    Hvis vi ikke har fått inntektsmeldingen innen 3 måneder etter at du søkte om sykepenger, henter vi
                    opplysninger om inntekten din fra A-ordningen i stedet. Du vil få beskjed fra oss når vi eventuelt
                    gjør dette.
                </BodyLong>
            </Box>

            <Heading level="2" size="small" spacing>
                Hvor lang tid tar det å behandle søknaden?
            </Heading>

            <BodyLong spacing>
                {'Du kan sjekke de oppdaterte saksbehandlingstidene på '}
                <LenkeMedAmplitude
                    url="https://www.nav.no/saksbehandlingstider#sykepenger"
                    tekst="nav.no/saksbehandlingstider#sykepenger"
                ></LenkeMedAmplitude>
                .
            </BodyLong>

            <Heading level="2" size="small" spacing>
                Har du spørsmål?
            </Heading>
            <BodyLong>
                {'Hvis det er noe du lurer på, kan du ta '}
                <LenkeMedAmplitude url="https://www.nav.no/kontaktoss" tekst="kontakt med oss."></LenkeMedAmplitude>
            </BodyLong>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
