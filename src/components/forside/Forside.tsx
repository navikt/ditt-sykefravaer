import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import Modal from 'nav-frontend-modal'
import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import setBodyClass from '../../utils/setBodyClass'
import { tekst } from '../../utils/tekster'
import Arbeidssituasjon from '../arbeidssituasjon/Arbeidssituasjon'
import Banner from '../banner/Banner'
import Brodsmuler, { Brodsmule } from '../brodsmuler/Brodsmuler'
import { IngenSykmelding } from '../ingen-sykmelding/IngenSykmelding'
import Lenker from '../lenker/Lenker'
import Oppgaver from '../oppgaver/Oppgaver'
import QueryStatusPanel from '../queryStatusPanel/QueryStatusPanel'
import TidslinjeUtdrag from '../tidslinje-utdrag/TidslinjeUtdrag'

const brodsmuler: Brodsmule[] = []

const Forside = () => {

    useEffect(() => {
        setBodyClass('forside')
        Modal.setAppElement('#maincontent')
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
                <QueryStatusPanel />
                <IngenSykmelding />
                <Oppgaver />
                <TidslinjeUtdrag />
                <Arbeidssituasjon />
                <Lenker />

                <AlertStripeInfo className="personvern">
                    {tekst('forside.personverninfo')}
                </AlertStripeInfo>

            </div>
        </>
    )
}

export default Forside
