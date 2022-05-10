import { BodyLong } from '@navikt/ds-react'
import parser from 'html-react-parser'
import { VenstreChevron } from 'nav-frontend-chevron'
import {
    Normaltekst,
    Sidetittel,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import Banner from '../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../components/brodsmuler/Brodsmuler'
import { setBodyClass } from '../utils/setBodyClass'
import { tekst } from '../utils/tekster'

const brodsmuler: Brodsmule[] = [
    {
        tittel: 'Inntektsmelding',
        sti: '/inntektsmelding',
        erKlikkbar: false,
    },
]

const Inntektsmelding = () => {
    const router = useRouter()
    useEffect(() => {
        setBodyClass('inntektsmelding')
    }, [])

    //TODO: hent arbeidsgivernavnet fra inntektsmeldingen
    return (
        <div>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('inntektsmelding.side-tittel-manglende')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Systemtittel tag="h2">
                    {tekst('inntektsmelding.side-tittel', {
                        '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                    })}
                </Systemtittel>

                <BodyLong spacing className="forklaring-bodylong">
                    {parser(
                        tekst('inntektsmelding.arbeidsgiver-har-fatt-beskjed')
                    )}
                </BodyLong>

                <BodyLong spacing className="forklaring-bodylong">
                    {parser(
                        tekst('inntektsmelding.soknaden-kan-ikke-behandles')
                    )}
                </BodyLong>

                <Undertittel>
                    {tekst('inntektsmelding.hva-er-inntekysmeldingen-tittel')}
                </Undertittel>

                <BodyLong spacing className="forklaring-bodylong">
                    {parser(
                        tekst(
                            'inntektsmelding.hva-er-inntekysmeldingen-forklaring'
                        )
                    )}
                </BodyLong>

                <Link href="/">
                    <a
                        className="ekstra-topp-margin lenke"
                        onClick={(e) => {
                            e.preventDefault()
                            router.push('/')
                        }}
                    >
                        <VenstreChevron />
                        <Normaltekst tag="span">Ditt sykefravær</Normaltekst>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default Inntektsmelding
