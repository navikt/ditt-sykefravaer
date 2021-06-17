import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import Vis from '../vis'
import Aktivitetsplan from './aktivitetsplan'
import SoknadLenkepanel from './soknader'
import SykmeldingLenkepanel from './sykmelding'
import UtbetalingAvSykepengerLenkepanel from './utbetaling'

const Lenker = () => {
    const { rsVedtak, soknader, sykmeldinger, arbeidsrettetOppfolging } = useAppStore()

    return (
        <section className="lenker">
            <Systemtittel tag="h2">Lenker</Systemtittel>
            <Vis hvis={sykmeldinger.length > 0}>
                <SykmeldingLenkepanel />
            </Vis>

            <Vis hvis={soknader.length > 0}>
                <SoknadLenkepanel />
            </Vis>

            <Vis hvis={rsVedtak.length > 0}>
                <UtbetalingAvSykepengerLenkepanel />
            </Vis>

            <Vis hvis={arbeidsrettetOppfolging?.underOppfolging}>
                <Aktivitetsplan />
            </Vis>
        </section>
    )
}

export default Lenker
