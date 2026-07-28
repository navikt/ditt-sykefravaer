import { ReactElement } from 'react'
import { Tag } from '@navikt/ds-react'

import { RegelStatus, StatusEvent } from '../../../types/sykmelding/sykmelding'

interface LenkepanelEtikettProps {
    status: StatusEvent
    behandlingsutfall: RegelStatus
}

function LenkepanelEtikett({ status, behandlingsutfall }: LenkepanelEtikettProps): ReactElement | null {
    if (behandlingsutfall === 'INVALID') {
        if (status === 'APEN' || status === 'BEKREFTET') {
            return (
                <Tag data-color="warning" variant="outline" size="small">
                    <span className="sr-only">, status: </span>Avvist av NAV
                </Tag>
            )
        }
    }

    switch (status) {
        case 'AVBRUTT':
            return (
                <Tag data-color="danger" variant="outline" size="small">
                    <span className="sr-only">, status: </span>Avbrutt av deg
                </Tag>
            )
        case 'SENDT':
            return (
                <Tag data-color="success" variant="outline" size="small">
                    <span className="sr-only">, status: </span>Sendt til arbeidsgiver
                </Tag>
            )
        case 'UTGATT':
            return (
                <Tag data-color="info" variant="outline" size="small">
                    <span className="sr-only">, status: </span>Utgått
                </Tag>
            )
        case 'BEKREFTET':
            return (
                <Tag data-color="success" variant="outline" size="small">
                    <span className="sr-only">, status: </span>Sendt til NAV
                </Tag>
            )
        default:
            return null
    }
}

export default LenkepanelEtikett
