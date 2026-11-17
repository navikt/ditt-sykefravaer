import { ReactElement } from 'react'
import { LinkCard, Tag } from '@navikt/ds-react'

import { RegelStatus, StatusEvent } from '../../../types/sykmelding/sykmelding'

interface LenkepanelEtikettProps {
    status: StatusEvent
    behandlingsutfall: RegelStatus
}

function LenkepanelEtikett({ status, behandlingsutfall }: LenkepanelEtikettProps): ReactElement | null {
    if (behandlingsutfall === 'INVALID') {
        if (status === 'APEN' || status === 'BEKREFTET') {
            return (
                <LinkCard.Footer>
                    <Tag data-color="warning" variant="outline" size="small">
                        <span className="sr-only">, status: </span>Avvist av Nav
                    </Tag>
                </LinkCard.Footer>
            )
        }
    }

    switch (status) {
        case 'AVBRUTT':
            return (
                <LinkCard.Footer>
                    <Tag data-color="danger" variant="outline" size="small">
                        <span className="sr-only">, status: </span>Avbrutt av deg
                    </Tag>
                </LinkCard.Footer>
            )
        case 'SENDT':
            return (
                <LinkCard.Footer>
                    <Tag data-color="success" variant="outline" size="small">
                        <span className="sr-only">, status: </span>Sendt til arbeidsgiver
                    </Tag>
                </LinkCard.Footer>
            )
        case 'UTGATT':
            return (
                <LinkCard.Footer>
                    <Tag data-color="info" variant="outline" size="small">
                        <span className="sr-only">, status: </span>Utgått
                    </Tag>
                </LinkCard.Footer>
            )
        case 'BEKREFTET':
            return (
                <LinkCard.Footer>
                    <Tag data-color="success" variant="outline" size="small">
                        <span className="sr-only">, status: </span>Sendt til Nav
                    </Tag>
                </LinkCard.Footer>
            )
        default:
            return null
    }
}

export default LenkepanelEtikett
