import { BodyLong, Heading, InlineMessage, ReadMore } from '@navikt/ds-react'
import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { breadcrumbBuilders, useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import { LenkeMedUmami } from '../components/lenke/lenke-med-umami'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.venterPaInntektsmelding())

    return (
        <>
            <Banner utenIkon={true} tittel="Vi venter på opplysninger fra arbeidsgiveren din" />

            <InlineMessage status="info" className="mb-8 font-bold">
                Dette er kun til informasjon, du trenger ikke gjøre noe
            </InlineMessage>

            <BodyLong spacing>
                Vi har bedt arbeidsgiveren din om å sende oss inntektsmelding, men ikke mottatt den enda. Når vi får
                den, kan vi starte å behandle søknaden din.
            </BodyLong>

            <ReadMore header="Hva er en inntektsmelding?" className="mb-8">
                Nav trenger en inntektsmelding fra arbeidsgiveren din for å kunne behandle søknaden. Inntektsmeldingen
                inneholder blant annet opplysninger om lønn, arbeidstid og fravær. Vi bruker opplysningene til å beregne
                hvor mye sykepenger du kan få.
            </ReadMore>

            <Heading level="2" size="small" spacing>
                Vi følger opp arbeidsgiveren din
            </Heading>
            <BodyLong spacing>
                Hvis vi ikke har hørt noe fra arbeidsgiveren din innen fire uker fra du sendte inn søknaden din, sender
                vi en purring til arbeidsgiveren din.
            </BodyLong>

            <BodyLong spacing>
                Har du spørsmål{', '}
                <LenkeMedUmami
                    url="https://innboks.nav.no/s/skriv-til-oss?category=Helse"
                    tekst="ta kontakt med Nav"
                ></LenkeMedUmami>{' '}
                så hjelper vi deg.
            </BodyLong>

            <BodyLong spacing>
                <LenkeMedUmami
                    url="https://www.nav.no/saksbehandlingstider#sykepenger"
                    tekst="Sjekk de oppdaterte saksbehandlingstider"
                ></LenkeMedUmami>
            </BodyLong>

            <Flexjar feedbackId="manglende-inntektsmelding" sporsmal="Var denne informasjonen nyttig for deg?" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
