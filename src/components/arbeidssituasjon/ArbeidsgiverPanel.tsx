import { BodyShort, Panel } from '@navikt/ds-react'
import React from 'react'

import useNarmesteledere from '../../hooks/useNarmesteledere'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverPanelProps {
    orgnummer: string
}

const ArbeidsgiverPanel = ({ orgnummer }: ArbeidsgiverPanelProps) => {
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    const navn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    const leder = narmesteLedere?.find((nl) => nl.orgnummer === orgnummer)

    return (
        <Panel className="bg-blue-50" data-cy="situasjon-innhold">
            <BodyShort spacing className="break-words">
            {/*<BodyShort spacing>*/}
                <strong>{navn}</strong>
            </BodyShort>
            <Vis
                hvis={leder?.arbeidsgiverForskutterer !== undefined}
                render={() => (
                    <BodyShort>
                        {tekst(
                            `din-situasjon.arbeidsgiver-forskutterer${leder?.arbeidsgiverForskutterer ? '' : '-ikke'}`,
                        )}
                    </BodyShort>
                )}
            />
            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
        </Panel>
    )
}

export default ArbeidsgiverPanel
