import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react'
import parser from 'html-react-parser'
import React, { useState } from 'react'

import { tekst } from '../../utils/tekster'
import Bjorn from '../bjorn/Bjorn'

const Friskmelding = () => {
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <>
            <Bjorn className="friskmelding__bjorn">
                <>
                    <BodyShort>{tekst('friskmelding.bjorn')}</BodyShort>
                    <Button onClick={() => setOpen(!open)}>
                        {tekst('friskmelding.bjorn-knapp')}
                    </Button>
                </>
            </Bjorn>
            <Modal open={open} onClose={() => setOpen(!open)}>
                <Modal.Content>
                    <Heading size="small">
                        {tekst('friskmelding.info-tittel.helt')}
                    </Heading>
                    <BodyShort>
                        {parser(tekst('friskmelding.info.helt'))}
                    </BodyShort>

                    <Heading size="small">
                        {tekst('friskmelding.info-tittel.delvis')}
                    </Heading>
                    <BodyShort>
                        {parser(tekst('friskmelding.info.delvis'))}
                    </BodyShort>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default Friskmelding
