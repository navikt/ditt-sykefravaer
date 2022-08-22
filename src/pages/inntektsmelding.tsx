import { Back } from '@navikt/ds-icons'
import { BodyLong, Heading, Panel } from '@navikt/ds-react'
import parser from 'html-react-parser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Banner from '../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../components/brodsmuler/Brodsmuler'
import { setBodyClass } from '../utils/setBodyClass'
import { tekst } from '../utils/tekster'

const brodsmuler: Brodsmule[] = [
    {
        tittel: 'Manglende inntektsmelding',
        sti: '/inntektsmelding',
        erKlikkbar: false,
    },
]

const Inntektsmelding = () => {
    const router = useRouter()

    useEffect(() => {
        setBodyClass('inntektsmelding')
    }, [])

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
                    {parser(tekst('inntektsmelding.arbeidsgiver-har-fatt-beskjed'))}
                </BodyLong>

                <Panel className="tekstbakgrunn">
                    <Heading size="small">{tekst('inntektsmelding.soknaden-kan-ikke-behandles.tittel')}</Heading>
                    <BodyLong>{parser(tekst('inntektsmelding.soknaden-kan-ikke-behandles'))}</BodyLong>
                </Panel>

                <Panel className="tekstbakgrunn">
                    <Heading size="small">{tekst('inntekstmelding.hvorfor.varsler.vi.tittel')}</Heading>
                    <BodyLong spacing>{parser(tekst('inntekstmelding.hvorfor.varsler.vi1'))}</BodyLong>
                    <BodyLong>{parser(tekst('inntekstmelding.hvorfor.varsler.vi2'))}</BodyLong>
                </Panel>

                <Panel className="tekstbakgrunn">
                    <Heading size="small">{tekst('inntektsmelding.hva-er-inntekysmeldingen-tittel')}</Heading>
                    <BodyLong>{tekst('inntektsmelding.hva-er-inntekysmeldingen-forklaring')}</BodyLong>
                </Panel>

                <Link href="/">
                    <a
                        className="lenke"
                        onClick={(e) => {
                            e.preventDefault()
                            router.push('/')
                        }}
                    >
                        <Back style={{ marginBottom: '-4px' }} title={'Til ditt sykefravær'} />
                        <BodyLong as="span">{tekst('sidetittel.liste')}</BodyLong>
                    </a>
                </Link>
            </div>
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
