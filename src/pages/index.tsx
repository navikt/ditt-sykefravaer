import React from 'react'

import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Arbeidssituasjon from '../components/arbeidssituasjon/Arbeidssituasjon'
import { IngenSykmelding } from '../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../components/lenker/Lenker'
import QueryStatusPanel from '../components/queryStatusPanel/QueryStatusPanel'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../hooks/useBreadcrumbs'
import { tekst } from '../utils/tekster'
import { Banner } from '../components/banner/Banner'
import Oppgaver from '../components/oppgaver/Oppgaver'
import { useToggle } from '../toggles/context'
import Maksdato from '../components/maksdato/Maksdato'
import UxSignalsPanel from '../components/ux-signals/esyfo-ux-signals/UxSignalsPanel'

const Index = () => {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.dittSykefravaer())
    const maksdatoToggle = useToggle('ditt-sykefravaer-maxdato')

    return (
        <>
            <Banner tittel={tekst('sidetittel.liste')} />

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            {maksdatoToggle.enabled && <Maksdato />}
            <UxSignalsPanel/>
            <Arbeidssituasjon />
            <Lenker />
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
