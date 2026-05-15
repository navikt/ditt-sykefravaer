import { BodyShort, Panel } from '@navikt/ds-react'
import React from 'react'

import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverPanelProps {
    orgnummer: string
}

const ArbeidsgiverPanel = ({ orgnummer }: ArbeidsgiverPanelProps) => {
    const { data: sykmeldinger } = useTsmSykmeldinger()

    const navn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    return (
        <Panel className="bg-blue-50" data-testid="situasjon-innhold">
            <BodyShort spacing className="break-words">
                {' '}
                {/* Mange arbeidsgivernavn er lange, de vil få en visning som ikke fungerer på mobil uten break-words, husk å sjekke hvordan det ser ut med lange arbeidsgivernavn om du fjerner break-words*/}
                <strong>{navn}</strong>
            </BodyShort>

            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
        </Panel>
    )
}

export default ArbeidsgiverPanel
