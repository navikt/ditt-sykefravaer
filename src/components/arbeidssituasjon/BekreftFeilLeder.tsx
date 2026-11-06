import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react'
import React from 'react'

import useAvkreftNarmesteLeder from '../../hooks/useAvkreftNarmesteLeder'
import { NarmesteLeder } from '../../types/narmesteLeder'

interface BekreftFeilLederProps {
    open: boolean
    toggle: () => void
    narmesteLeder: NarmesteLeder
    orgNavn: string
}

const BekreftFeilLeder = ({ open, toggle, narmesteLeder, orgNavn }: BekreftFeilLederProps) => {
    const { mutateAsync: avkreft, isPending, isSuccess, isError } = useAvkreftNarmesteLeder(narmesteLeder.id)

    if (!narmesteLeder.navn.trim()) {
        return null
    }

    const bekreft = async () => {
        try {
            await avkreft()
            toggle()
        } catch {
            // Feilen vises av mutasjonen i dialogen.
        }
    }

    return (
        <Modal
            open={open}
            onClose={toggle}
            className="w-96"
            aria-label="Endre nærmeste leder"
            header={{
                heading: 'Endre nærmeste leder',
                closeButton: false,
                size: 'small',
            }}
        >
            <Modal.Body>
                {isError && <Alert variant="error">Beklager, det oppstod en feil! Vennligst prøv igjen senere.</Alert>}

                <BodyLong spacing>
                    Er du sikker på at du vil fjerne <strong>{narmesteLeder.navn}</strong> som din nærmeste leder i{' '}
                    <strong>{orgNavn}</strong>?
                </BodyLong>
                <BodyLong spacing>
                    Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor de har valgt
                    det.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    data-color="danger"
                    variant="primary"
                    loading={isPending}
                    type="button"
                    disabled={isPending || isSuccess}
                    onClick={bekreft}
                >
                    Ja, jeg er sikker
                </Button>
                <Button variant="secondary" onClick={toggle} type="button">
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BekreftFeilLeder
