import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import { NarmesteLeder } from '../../types/narmesteLeder'
import Vis from '../vis'

interface BekreftFeilLederProps {
    open: boolean,
    toggle: () => void,
    narmesteLeder: NarmesteLeder,
    orgNavn: string
}

const BekreftFeilLeder = ({ open, toggle, narmesteLeder, orgNavn }: BekreftFeilLederProps) => {
    const [ avkrefter, setAvkrefter ] = useState<boolean>(false)
    // TODO: Må holde state på om nl er avkreftet for å vise egen tekst, avkreftete ledere blir ikke med i oversikten neste gang man går inn
    const avkreftet = false

    useEffect(() => {
        Modal.setAppElement('#maincontent')
    }, [])

    const avkreftLeder = () => {
        /***
         * prod = https://narmesteleder.nav.no
         * dc = http://localhost:6998/api/v1/syforest
         * NY lokal og dev i samme = https://narmesteleder.dev.nav.no
         */
        // TODO: Sett opp logikk for avkrefting av leder
        setAvkrefter(true)
        const backend = 'https://narmesteleder.nav.no'
        const url = `${backend}/${narmesteLeder.orgnummer}/avkreft`
        console.log('AVKREFTER!') // eslint-disable-line
    }

    return (
        <Modal
            isOpen={open}
            closeButton={true}
            contentLabel="Modal"
            onRequestClose={toggle}
        >
            <Vis hvis={avkreftet}>
                <Undertittel tag="h2">Takk for oppdateringen!</Undertittel>
            </Vis>
            <Vis hvis={!avkreftet}>
                <Undertittel tag="h2">Endre nærmeste leder</Undertittel>
                <Normaltekst>Er du sikker på at du vil fjerne <strong>{narmesteLeder.navn}</strong> som din nærmeste leder i <strong>{orgNavn}</strong>?</Normaltekst>
                <Normaltekst>Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor de har valgt det.</Normaltekst>

                <div className="knapperad">
                    <Knapp
                        htmlType="button"
                        spinner={avkrefter}
                        onClick={avkreftLeder}
                    >
                        Ja, jeg er sikker
                    </Knapp>
                    <a className="lenke js-avbryt" onClick={toggle}>
                        <Normaltekst>Avbryt</Normaltekst>
                    </a>
                </div>
            </Vis>
        </Modal>
    )
}

export default BekreftFeilLeder
