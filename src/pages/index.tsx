import { Heading, Modal } from '@navikt/ds-react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import Banner from '../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../components/brodsmuler/Brodsmuler'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { tekst } from '../utils/tekster'

const brodsmuler: Brodsmule[] = []

const Index = () => {
    useEffect(() => {
        // eslint-disable-next-line
        // @ts-ignore
        Modal.setAppElement('#root')
    }, [])

    const Oppgaver = dynamic(() => import('../components/oppgaver/Oppgaver'), {
        ssr: false,
    })
    return (
        <>
            <Banner>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    {tekst('sidetittel.liste')}
                </Heading>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <QueryStatusPanel />
                <IngenSykmelding />
                <Oppgaver />
                <Arbeidssituasjon />
                <Lenker />
            </div>
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
