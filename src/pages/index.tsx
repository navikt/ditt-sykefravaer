import { Heading, Modal } from '@navikt/ds-react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import Person from '../components/person/Person'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { PageWrapper } from '../components/PageWrapper'

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
        <PageWrapper>
            <header className="sidebanner">
                <div>
                    <img
                        className="sidebanner__ikon"
                        src="/syk/sykefravaer/static/ditt-sykefravaer-ikon.svg"
                        width={64}
                        height={64}
                        alt=""
                    />
                    <Heading size="xlarge" level="1" className="sidebanner__tittel">
                        {tekst('sidetittel.liste')}
                    </Heading>
                </div>
                <Person />
            </header>

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            <Arbeidssituasjon />
            <Lenker />
        </PageWrapper>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
