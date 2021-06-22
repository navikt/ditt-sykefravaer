import './forside.less'

import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import Arbeidssituasjon from '../../components/arbeidssituasjon/arbeidssituasjon'
import Banner from '../../components/banner/banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/brodsmuler'
import { IngenSykmelding } from '../../components/ingen-sykmelding/ingen-sykmelding'
import Lenker from '../../components/lenker/lenker'
import Oppgaver from '../../components/oppgaver/oppgaver'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import { setBodyClass } from '../../utils/utils'

const brodsmuler: Brodsmule[] = []

const Forside = () => {

    useEffect(() => {
        setBodyClass('forside')
    }, [])


    return (
        <>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('sidetittel.liste')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <IngenSykmelding />
                <Oppgaver />
                <Arbeidssituasjon />
                <Lenker />
                <AlertStripeInfo>{tekst('forside.personverninfo')}</AlertStripeInfo>
            </div>
        </>
    )
}

export default Forside
