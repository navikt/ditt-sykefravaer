import parser from 'html-react-parser'
import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import { tekst } from '../../utils/tekster'
import Bjorn from '../bjorn/Bjorn'

const Friskmelding = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Bjorn className="friskmelding__bjorn">
                <>
                    <Normaltekst>{tekst('friskmelding.bjorn')}</Normaltekst>
                    <Knapp onClick={() => setOpen(!open)}>
                        {tekst('friskmelding.bjorn-knapp')}
                    </Knapp>
                </>
            </Bjorn>
            <Modal
                isOpen={open}
                closeButton={true}
                contentLabel="Friskmelding"
                onRequestClose={() => setOpen(!open)}
            >
                <Undertittel>
                    {tekst('friskmelding.info-tittel.helt')}
                </Undertittel>
                <Normaltekst>
                    {parser(tekst('friskmelding.info.helt'))}
                </Normaltekst>

                <Undertittel>
                    {tekst('friskmelding.info-tittel.delvis')}
                </Undertittel>
                <Normaltekst>
                    {parser(tekst('friskmelding.info.delvis'))}
                </Normaltekst>
            </Modal>
        </>
    )
}

export default Friskmelding
