import './forside.less'

import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { VenstreChevron } from 'nav-frontend-chevron'
import Lenke from 'nav-frontend-lenker'
import Modal from 'nav-frontend-modal'
import { Normaltekst,Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect } from 'react'

import Arbeidssituasjon from '../../components/arbeidssituasjon/Arbeidssituasjon'
import Banner from '../../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/Brodsmuler'
import { IngenSykmelding } from '../../components/ingen-sykmelding/IngenSykmelding'
import Lenker from '../../components/lenker/Lenker'
import Oppgaver from '../../components/oppgaver/Oppgaver'
import QueryStatusPanel from '../../components/queryStatusPanel/QueryStatusPanel'
import TidslinjeUtdrag from '../../components/tidslinje-utdrag/TidslinjeUtdrag'
import env from '../../utils/environment'
import setBodyClass from '../../utils/setBodyClass'
import { tekst } from '../../utils/tekster'

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


                <Lenke className="forside-lenke" href={env.sykepengerDokumenterUrl()}>
                    <VenstreChevron />
                    <Normaltekst tag="span">{tekst('forside.se-alle-dokumenter')}</Normaltekst>
                </Lenke>

            </div>
        </>
    )
}

export default Forside
