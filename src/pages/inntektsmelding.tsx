import { BodyLong, Heading, Panel } from '@navikt/ds-react'
import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import { LenkeMedAmplitude } from '../components/lenke/lenke-med-amplitude'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Forsinket saksbehandlingstid' }],
        [],
    )

    return (
        <>
            <Banner utenIkon={true} tittel="Vi må bruke lenger tid på å behandle søknaden din" />

            <Heading level="2" size="medium" spacing>
                Vi mangler inntektsmelding fra arbeidsgiveren din
            </Heading>

            <BodyLong spacing>
                Vi har dessverre ikke mottatt inntektsmelding fra arbeidsgiveren din, og vi trenger denne for å behandle
                søknaden din om sykepenger. Vi trenger inntektsmelding for å vurdere om du har rett til sykepenger og
                eventuelt hvor mye du har rett til.
            </BodyLong>

            <BodyLong spacing>
                Vi har varslet arbeidsgiveren din om dette. Hvis arbeidsgiveren din betaler deg lønn som vanlig mens du
                er sykmeldt, trenger du ikke å gjøre noe med dette.
            </BodyLong>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hva kan du gjøre?
                </Heading>
                <BodyLong>
                    Ta kontakt med arbeidsgiveren din og be om at de sender inntektsmeldingen til NAV så fort som mulig.
                </BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hvor lang tid tar det å behandle søknaden?
                </Heading>
                <BodyLong>
                    {
                        'Saksbehandlingstiden starter fra når vi har mottatt både søknaden din og inntektsmeldingen fra arbeidsgiveren din. Saksbehandlingstiden kan være opptil fire uker etter at arbeidsgiveren din har sendt inn inntektsmeldingen. Du finner mer informasjon om inntektsmelding og saksbehandlingstid på '
                    }
                    <LenkeMedAmplitude
                        url="https://www.nav.no/sykepenger#utbetaling"
                        tekst="nav.no/sykepenger"
                    ></LenkeMedAmplitude>
                    .
                </BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Har du spørsmål?
                </Heading>
                <BodyLong>
                    {'Hvis det er noe du lurer på, kan du ta '}
                    <LenkeMedAmplitude url="https://www.nav.no/kontaktoss" tekst="kontakt med oss."></LenkeMedAmplitude>
                </BodyLong>
            </Panel>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
