import { BodyLong, Heading, Panel } from '@navikt/ds-react'
import React from 'react'

import { parserWithReplace } from '../utils/html-react-parser-utils'
import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'

const Inntektsmelding = () => {
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Manglende inntektsmelding' }],
        [],
    )

    return (
        <>
            <Banner utenIkon={true} tittel={tekst('inntektsmelding.side-tittel-manglende')} />

            <Heading level="2" size="medium">
                {tekst('inntektsmelding.side-tittel', {
                    '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                })}
            </Heading>

            <BodyLong spacing>{parserWithReplace(tekst('inntektsmelding.arbeidsgiver-har-fatt-beskjed'))}</BodyLong>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    {tekst('inntektsmelding.soknaden-kan-ikke-behandles.tittel')}
                </Heading>
                <BodyLong>{parserWithReplace(tekst('inntektsmelding.soknaden-kan-ikke-behandles'))}</BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    {tekst('inntekstmelding.hvorfor.varsler.vi.tittel')}
                </Heading>
                <BodyLong spacing>{parserWithReplace(tekst('inntekstmelding.hvorfor.varsler.vi1'))}</BodyLong>
                <BodyLong>{parserWithReplace(tekst('inntekstmelding.hvorfor.varsler.vi2'))}</BodyLong>
            </Panel>

            <Panel className="my-8 bg-blue-50">
                <Heading level="2" size="small">
                    {tekst('inntektsmelding.hva-er-inntekysmeldingen-tittel')}
                </Heading>
                <BodyLong>{tekst('inntektsmelding.hva-er-inntekysmeldingen-forklaring')}</BodyLong>
            </Panel>

            <Flexjar feedbackId="manglende-inntektsmelding" />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
