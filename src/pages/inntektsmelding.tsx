import { BodyLong, Heading, Panel } from '@navikt/ds-react'
import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import { LenkeMedAmplitude } from '../components/lenke/lenke-med-amplitude'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Manglende inntektsmelding' }],
        [],
    )

    return (
        <>
            <Banner utenIkon={true} tittel="Vi må bruke lenger tid på å behandle søknaden din" />

            <Heading level="2" size="medium" spacing>
                Vi mangler inntektsmelding fra arbeidsgiveren din
            </Heading>

            <BodyLong spacing>
                Vi har dessverre ikke mottatt inntektsmelding fra arbeidsgiveren din, vi trenger denne for å behandle
                søknaden din om sykepenger. Arbeidsgiveren din skal ha blitt varslet om at vi trenger inntektsmelding.
                Om du får betalt lønn som vanlig av din arbeidsgiver mens du er sykmeldt, er dette ikke noe du trenger å
                gjøre noe med.
            </BodyLong>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hvorfor er dette viktig?
                </Heading>
                <BodyLong>
                    Uten inntektsmelding kan vi ikke behandle søknaden din om sykepenger, og du kan ikke få utbetalt
                    sykepenger. Vi trenger inntektsmelding for å vurdere retten din til sykepenger og eventuelt
                    størrelsen på sykepengene.
                </BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hva kan du gjøre?
                </Heading>
                <BodyLong spacing>
                    Ta kontakt med arbeidsgiveren din og be om at de sender inntektsmeldingen til NAV snarest mulig.
                </BodyLong>
                <BodyLong>
                    {'Du kan også finne mer informasjon om inntektsmelding og saksbehandlingstid på '}
                    <LenkeMedAmplitude
                        url="https://www.nav.no/sykepenger#utbetaling"
                        tekst="nav.no/sykepenger"
                    ></LenkeMedAmplitude>
                </BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Hvor lang tid tar det å behandle søknaden?
                </Heading>
                <BodyLong>
                    Saksbehandlingstiden starter når vi har mottatt både søknaden din og inntektsmeldingen fra
                    arbeidsgiveren. Forventet saksbehandlingstid kan være opp til fire uker etter at arbeidsgiveren din
                    har sendt inn inntektsmelding.
                </BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    Har du spørsmål?
                </Heading>
                <BodyLong>
                    {'Du kan finne mer informasjon på '}
                    <LenkeMedAmplitude
                        url="https://www.nav.no/sykepenger"
                        tekst="nav.no/sykepenger"
                    ></LenkeMedAmplitude>
                    {' eller du kan kontakte NAV kundeservice.'}
                </BodyLong>
            </Panel>

            <BodyLong>Takk for din forståelse!</BodyLong>

            <Flexjar feedbackId="manglende-inntektsmelding" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
