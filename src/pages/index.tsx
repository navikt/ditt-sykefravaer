import { Modal } from '@navikt/ds-react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'

const Index = () => {
    useUpdateBreadcrumbs(() => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }], [])

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
            <Banner tittel={tekst('sidetittel.liste')} />

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            <Arbeidssituasjon />
            <Lenker />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
