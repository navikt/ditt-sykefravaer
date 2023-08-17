import { Modal } from '@navikt/ds-react'
import React, { useEffect } from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'
import { Feedback } from '../components/feedback/feedback'
import Oppgaver from '../components/oppgaver/Oppgaver'

const Index = () => {
    useUpdateBreadcrumbs(() => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }], [])

    useEffect(() => {
        // eslint-disable-next-line
        // @ts-ignore
        Modal.setAppElement('#root')
    }, [])

    return (
        <>
            <Banner tittel={tekst('sidetittel.liste')} />

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            <Arbeidssituasjon />
            <Lenker />
            <Feedback />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
