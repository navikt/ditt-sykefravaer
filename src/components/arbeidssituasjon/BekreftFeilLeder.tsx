import {
    Alert,
    BodyLong,
    BodyShort,
    Button,
    Heading,
    Modal,
} from '@navikt/ds-react'
import React from 'react'

import useAvkreftNarmesteLeder from '../../query-hooks/useAvkreftNarmesteLeder'
import { NarmesteLeder } from '../../types/narmesteLeder'
import Vis from '../Vis'

interface BekreftFeilLederProps {
    open: boolean
    toggle: () => void
    narmesteLeder: NarmesteLeder
    orgNavn: string
}

const BekreftFeilLeder = ({
    open,
    toggle,
    narmesteLeder,
    orgNavn,
}: BekreftFeilLederProps) => {
    const {
        mutate: avkreft,
        isIdle,
        isLoading,
        isSuccess,
        isError,
    } = useAvkreftNarmesteLeder(narmesteLeder.orgnummer)

    return (
        <Modal
            open={open}
            closeButton={true}
            onClose={toggle}
            aria-label="Endre nærmeste leder"
        >
            <Modal.Content>
                <Heading spacing size="small" level="1">
                    Endre nærmeste leder
                </Heading>

                <Vis
                    hvis={isSuccess}
                    render={() => (
                        <BodyShort>Takk for oppdateringen!</BodyShort>
                    )}
                />

                <Vis
                    hvis={isError}
                    render={() => (
                        <Alert variant="error">
                            Beklager, det oppstod en feil! Vennligst prøv igjen
                            senere.
                        </Alert>
                    )}
                />

                <Vis
                    hvis={isIdle || isLoading}
                    render={() => (
                        <>
                            <BodyLong spacing>
                                Er du sikker på at du vil fjerne{' '}
                                <strong>{narmesteLeder.navn}</strong> som din
                                nærmeste leder i <strong>{orgNavn}</strong>?
                            </BodyLong>
                            <BodyLong spacing>
                                Hvis du er usikker på om navnet er riktig, bør
                                du spørre arbeidsgiveren din om hvorfor de har
                                valgt det.
                            </BodyLong>

                            <div className="knapperad">
                                <Button
                                    variant="danger"
                                    loading={isLoading}
                                    disabled={isLoading}
                                    onClick={() => avkreft()}
                                >
                                    Ja, jeg er sikker
                                </Button>
                                <button className="lenke" onClick={toggle}>
                                    <BodyShort>Avbryt</BodyShort>
                                </button>
                            </div>
                        </>
                    )}
                />
            </Modal.Content>
        </Modal>
    )
}

export default BekreftFeilLeder
