import { BodyShort, Panel } from '@navikt/ds-react'
import React from 'react'

import useNarmesteledere from '../../hooks/useNarmesteledere'
import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'
import { tekst } from '../../utils/tekster'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverPanelProps {
    orgnummer: string
}

const ArbeidsgiverPanel = ({ orgnummer }: ArbeidsgiverPanelProps) => {
    const { data: sykmeldinger } = useTsmSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    const navn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    const leder = narmesteLedere?.find((nl) => nl.orgnummer === orgnummer)

    return (
        <Panel className="bg-blue-50" data-testid="situasjon-innhold">
            <BodyShort spacing className="break-words">
                {' '}
                {/* Mange arbeidsgivernavn er lange, de vil få en visning som ikke fungerer på mobil uten break-words, husk å sjekke hvordan det ser ut med lange arbeidsgivernavn om du fjerner break-words*/}
                <strong>{navn}</strong>
            </BodyShort>
            {leder?.arbeidsgiverForskutterer !== undefined && (
                <BodyShort>
                    {tekst(`din-situasjon.arbeidsgiver-forskutterer${leder?.arbeidsgiverForskutterer ? '' : '-ikke'}`)}
                </BodyShort>
            )}

            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
        </Panel>
    )
}

export default ArbeidsgiverPanel
