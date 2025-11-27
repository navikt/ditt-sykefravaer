import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'
import { Flexjar } from '../components/flexjar/flexjar'
import Oppgaver from '../components/oppgaver/Oppgaver'
import { useToggle } from '../toggles/context'
import Maksdato from '../components/maksdato/Maksdato'

const Index = () => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.dittSykefravaer())
    const flexjarToggle = useToggle('flexjar-ditt-sykefravaer-fant-du')
    const maksdatoToggle = useToggle('ditt-sykefravaer-maxdato')

    return (
        <>
            <Banner tittel={tekst('sidetittel.liste')} />

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            {maksdatoToggle.enabled && <Maksdato />}
            <Arbeidssituasjon />
            <Lenker />

            {flexjarToggle.enabled && <Flexjar feedbackId="ditt-sykefravaer-fant-du" />}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
