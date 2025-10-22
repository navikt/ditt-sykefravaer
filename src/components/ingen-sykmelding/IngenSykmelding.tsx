import { GuidePanel } from '@navikt/ds-react'
import React from 'react'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import { veileder } from '../../grafikk/Veileder'
import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'
import { tekst } from '../../utils/tekster'

export const IngenSykmelding = () => {
    const { data: sykmeldinger } = useTsmSykmeldinger()

    if (!sykmeldinger || sykmeldinger.length > 0) {
        return null
    }

    return (
        <GuidePanel className="mb-4" illustration={veileder} poster={true}>
            {parserWithReplace(tekst('ingen.sykmelding'))}
        </GuidePanel>
    )
}
