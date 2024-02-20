import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import Oppgaver from '../components/oppgaver/Oppgaver'
import { useToggle } from '../toggles/context'
import useMaxDate from '../hooks/useMaxDate'

const Index = () => {
    useUpdateBreadcrumbs(() => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }], [])
    const flexjarToggle = useToggle('flexjar-ditt-sykefravaer-fant-du')
    const { data: maxdato } = useMaxDate()
    return (
        <>
            <Banner tittel={tekst('sidetittel.liste')} />
            {JSON.stringify(maxdato)}
            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            <Arbeidssituasjon />
            <Lenker />
            {flexjarToggle.enabled && <Flexjar feedbackId="ditt-sykefravaer-fant-du" />}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
