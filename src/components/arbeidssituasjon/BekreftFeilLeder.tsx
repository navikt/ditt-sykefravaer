import Alertstripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import { NarmesteLeder } from '../../types/narmesteLeder'
import env from '../../utils/environment'
import Vis from '../Vis'

interface BekreftFeilLederProps {
    open: boolean,
    toggle: () => void,
    narmesteLeder: NarmesteLeder,
    orgNavn: string
}

type NarmesteLederStatus = 'AKTIV' | 'AVKREFTET' | 'ERROR'

const BekreftFeilLeder = ({ open, toggle, narmesteLeder, orgNavn }: BekreftFeilLederProps) => {
    const [ avkrefter, setAvkrefter ] = useState<boolean>(false)
    const [ narmesteLederStatus, setNarmesteLederStatus ] = useState<NarmesteLederStatus>('AKTIV')

    const avkreftLeder = () => {
        setAvkrefter(true)

        fetch(`${env.narmestelederUrl}/${narmesteLeder.orgnummer}/avkreft`, {
            method: 'POST',
            credentials: 'include',
        }).then((res) => {
            if (res.ok) {
                setNarmesteLederStatus('AVKREFTET')
            } else {
                setNarmesteLederStatus('ERROR')
            }
        }).catch(() =>
            setNarmesteLederStatus('ERROR')
        ).finally(() =>
            setAvkrefter(false)
        )
    }

    return (
        <Modal
            isOpen={open}
            closeButton={true}
            contentLabel="Modal"
            onRequestClose={toggle}
        >
            <Undertittel tag="h2">Endre nærmeste leder</Undertittel>

            <Vis hvis={narmesteLederStatus === 'AVKREFTET'}>
                <Normaltekst>Takk for oppdateringen!</Normaltekst>
            </Vis>
            <Vis hvis={narmesteLederStatus === 'ERROR'}>
                <Alertstripe type="feil">
                    Beklager, det oppstod en feil! Vennligst prøv igjen senere.
                </Alertstripe>
            </Vis>
            <Vis hvis={narmesteLederStatus === 'AKTIV'}>
                <Normaltekst>Er du sikker på at du vil fjerne <strong>{narmesteLeder.navn}</strong> som din nærmeste leder i <strong>{orgNavn}</strong>?</Normaltekst>
                <Normaltekst>Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor de har valgt det.</Normaltekst>

                <div className="knapperad">
                    <Knapp
                        type="fare"
                        spinner={avkrefter}
                        onClick={avkreftLeder}
                    >
                        Ja, jeg er sikker
                    </Knapp>
                    <button className="lenke" onClick={toggle}>
                        <Normaltekst>Avbryt</Normaltekst>
                    </button>
                </div>
            </Vis>
        </Modal>
    )
}

export default BekreftFeilLeder
