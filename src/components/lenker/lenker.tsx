import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import Vis from '../vis'
import Aktivitetsplan from './aktivitetsplan'
import SoknadLenkepanel from './soknader'
import SykmeldingLenkepanel from './sykmelding'
import UtbetalingAvSykepengerLenkepanel from './utbetaling'

const Lenker = () => {
    const { rsVedtak, arbeidsrettetOppfolging } = useAppStore()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()


    return (
        <section className="lenker">
            <Systemtittel tag="h2">Lenker</Systemtittel>
            <Vis hvis={sykmeldinger && sykmeldinger.length > 0}>
                <SykmeldingLenkepanel />
            </Vis>

            <Vis hvis={soknader && soknader.length > 0}>
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
