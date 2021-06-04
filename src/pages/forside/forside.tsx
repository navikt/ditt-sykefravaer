import './forside.less'

import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import Banner from '../../components/banner/banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/brodsmuler'
import { tekst } from '../../utils/tekster'
import { setBodyClass } from '../../utils/utils'

const brodsmuler: Brodsmule[] = []

const Forside = () => {

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
                <h1>Ditt sykefravær</h1>
            </div>
        </>
    )
}

export default Forside
