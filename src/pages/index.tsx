import React from 'react'
import { GuidePanel } from '@navikt/ds-react'

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

const Index = () => {
    useUpdateBreadcrumbs(() => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }], [])
    const flexjarToggle = useToggle('flexjar-ditt-sykefravaer-fant-du')

    return (
        <>
            <Banner tittel={tekst('sidetittel.liste')} />

            <QueryStatusPanel />
            <IngenSykmelding />
            <Oppgaver />
            <GuidePanel className="mt-8">
                Du har nå vært sykmeldt i 30 uker. Hvis du lurer på hvor lenge du har rett til sykepenger, kan dy sjekke
                din
                <a
                    href="https://demo.ekstern.dev.nav.no/syk/sykepenger?id=a147e9a9-0aa2-4f5f-a8e3-c16c901e4071"
                    target="_blank"
                >
                    {' '}
                    siste svar på sykpengesøknad.
                </a>
            </GuidePanel>
            <Arbeidssituasjon />
            <Lenker />
            {flexjarToggle.enabled && <Flexjar feedbackId="ditt-sykefravaer-fant-du" />}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Index
