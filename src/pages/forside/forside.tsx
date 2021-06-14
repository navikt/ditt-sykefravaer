import './forside.less'

import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import Banner from '../../components/banner/banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/brodsmuler'
import SoknadLenkepanel from '../../components/lenker/soknader'
import SykmeldingLenkepanel from '../../components/lenker/sykmelding'
import UtbetalingAvSykepengerLenkepanel from '../../components/lenker/utbetaling'
import Oppgaver from '../../components/oppgaver/oppgaver'
import Vis from '../../components/vis'
import { useAppStore } from '../../data/stores/app-store'
import { tekst } from '../../utils/tekster'
import { setBodyClass } from '../../utils/utils'

const brodsmuler: Brodsmule[] = []

const Forside = () => {

    const { rsVedtak, soknader, sykmeldinger } = useAppStore()

    useEffect(() => {
        setBodyClass('forside')
    }, [])

    return (
        <>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('spinnsyn.sidetittel.liste')}
                </Sidetittel>
            </Banner>
            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Oppgaver />

                <Vis hvis={sykmeldinger.length > 0}>
                    <SykmeldingLenkepanel />
                </Vis>

                <Vis hvis={soknader.length > 0}>
                    <SoknadLenkepanel />
                </Vis>

                <Vis hvis={rsVedtak.length > 0}>
                    <UtbetalingAvSykepengerLenkepanel />
                </Vis>

                <AlertStripeInfo>{tekst('forside.personverninfo')}</AlertStripeInfo>
            </div>
        </>
    )
}

export default Forside
