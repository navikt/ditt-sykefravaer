import './forside.less'

import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import Banner from '../../components/banner/banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/brodsmuler'
import SoknadLenkepanel from '../../components/lenker/soknader'
import UtbetalingAvSykepengerLenkepanel from '../../components/lenker/utbetaling'
import Vis from '../../components/vis'
import { useAppStore } from '../../data/stores/app-store'
import { tekst } from '../../utils/tekster'
import { setBodyClass } from '../../utils/utils'

const brodsmuler: Brodsmule[] = []

const Forside = () => {

    const { rsVedtak, soknader } = useAppStore()

    useEffect(() => {
        setBodyClass('vedtak-liste')
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
                <Vis hvis={soknader.length > 0}>
                    <SoknadLenkepanel />
                </Vis>

                <Vis hvis={rsVedtak.length > 0}>
                    <UtbetalingAvSykepengerLenkepanel />
                </Vis>
            </div>
        </>
    )
}

export default Forside
