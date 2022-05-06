import { Back } from '@navikt/ds-icons'
import { BodyLong, Heading } from '@navikt/ds-react'
import parser from 'html-react-parser'
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
        <>
            <Banner>
                <Heading size="xlarge" className="sidebanner__tittel">
                    {tekst('inntektsmelding.side-tittel-manglende')}
                </Heading>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Heading size="medium">
                    {tekst('inntektsmelding.side-tittel', {
                        '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                    })}
                </Heading>

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

                <Heading size="small">
                    {tekst('inntektsmelding.hva-er-inntekysmeldingen-tittel')}
                </Heading>

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
                        <Back />
                        <BodyLong as="span">
                            {tekst('sidetittel.liste')}
                        </BodyLong>
                    </a>
                </Link>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default Inntektsmelding
