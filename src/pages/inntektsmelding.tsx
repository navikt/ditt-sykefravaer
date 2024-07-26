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
                Vi har ikke mottatt inntektsmelding fra arbeidsgiveren din, som vi trenger for å behandle søknaden om
                sykepenger. Inntektsmeldingen brukes for å vurdere om du har rett til sykepenger og eventuelt hvor mye
                du har rett til. Vi har varslet arbeidsgiveren din om dette.
            </BodyLong>
            <Heading level="2" size="small">
                Hvorfor får du denne beskjeden?
            </Heading>
            <BodyLong spacing>
                Vi sender dette til alle fordi vi ikke vet om du får lønn fra arbeidsgiveren din eller om du får
                sykepenger fra NAV. Du behøver ikke gjøre noe nå, men dersom det haster å få behandlet søknaden din kan
                du gjøre behandlingstiden kortere ved å kontakte arbeidsgiveren din.
            </BodyLong>
            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hva kan du gjøre?
                </Heading>
                <BodyLong>
                    Hvis du ikke får lønn fra arbeidsgiveren under sykefraværet, ta kontakt med arbeidsgiveren din og be
                    de om å sende inntektsmeldingen til NAV så fort som mulig.
                </BodyLong>
            </Box>

            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hvor lang tid tar det å behandle søknaden?
                </Heading>

                <BodyLong>
                    {
                        'Saksbehandlingstiden starter fra når vi har mottatt både søknaden din og inntektsmeldingen fra arbeidsgiveren din. Saksbehandlingstiden er som regel opptil fire uker etter at arbeidsgiveren din har sendt inn inntektsmeldingen. I perioder kan saksbehandlingstiden være lenger. Du finner oppdatert informasjon om inntektsmelding og forventet saksbehandlingstid på '
                    }
                    <LenkeMedAmplitude
                        url="https://www.nav.no/sykepenger#utbetaling"
                        tekst="nav.no/sykepenger"
                    ></LenkeMedAmplitude>
                    .
                </BodyLong>
            </Box>

            <Box padding="4" borderRadius="small" className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Har du spørsmål?
                </Heading>
                <BodyLong>
                    {'Hvis det er noe du lurer på, kan du ta '}
                    <LenkeMedAmplitude url="https://www.nav.no/kontaktoss" tekst="kontakt med oss."></LenkeMedAmplitude>
                </BodyLong>
            </Box>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
