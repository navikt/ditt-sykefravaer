import { ReactElement } from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'

export function OptInSuksessAlert(): ReactElement {
    return (
        <Alert variant="info" role="status">
            <Heading size="small" level="3" spacing>
                Vi oppretter søknad etter sykmeldingsperioden er over
            </Heading>
            <BodyShort>
                Du vil få beskjed av oss når du skal fylle ut og sende inn søknaden om sykepenger for
                sykmeldingsperioden.
            </BodyShort>
        </Alert>
    )
}
