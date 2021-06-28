import Alertstripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React from 'react'

import useAvkreftNarmesteLeder from '../../query-hooks/useAvkreftNarmesteLeder'
import { NarmesteLeder } from '../../types/narmesteLeder'
import Vis from '../Vis'

interface BekreftFeilLederProps {
    open: boolean,
    toggle: () => void,
    narmesteLeder: NarmesteLeder,
    orgNavn: string
}

const BekreftFeilLeder = ({ open, toggle, narmesteLeder, orgNavn }: BekreftFeilLederProps) => {
    const { mutate: avkreft, isIdle, isLoading, isSuccess, error } = useAvkreftNarmesteLeder(narmesteLeder.orgnummer)

    return (
        <Modal
            isOpen={open}
            closeButton={true}
            contentLabel="Modal"
            onRequestClose={toggle}
        >
            <Undertittel tag="h2">Endre nærmeste leder</Undertittel>

            <Vis hvis={isSuccess}
                render={() =>
                    <Normaltekst>Takk for oppdateringen!</Normaltekst>
                }
            />

            <Vis hvis={error?.message}
                render={() =>
                    <Alertstripe type="feil">
                        Beklager, det oppstod en feil! Vennligst prøv igjen senere.
                    </Alertstripe>
                }
            />

            <Vis hvis={isIdle}
                render={() =>
                    <>
                        <Normaltekst>Er du sikker på at du vil fjerne <strong>{narmesteLeder.navn}</strong> som din nærmeste
                        leder i <strong>{orgNavn}</strong>?</Normaltekst>
                        <Normaltekst>Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor
                        de har valgt det.</Normaltekst>

                        <div className="knapperad">
                            <Knapp type="fare"
                                spinner={isLoading}
                                disabled={isLoading}
                                onClick={() => avkreft()}
                            >
                                Ja, jeg er sikker
                            </Knapp>
                            <button className="lenke" onClick={toggle}>
                                <Normaltekst>Avbryt</Normaltekst>
                            </button>
                        </div>
                    </>
                }
            />
        </Modal>
    )
}

export default BekreftFeilLeder
