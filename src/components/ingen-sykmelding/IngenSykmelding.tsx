import { GuidePanel } from '@navikt/ds-react'
import React from 'react'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import { veileder } from '../../grafikk/Veileder'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'

export const IngenSykmelding = () => {
    const { data: sykmeldinger } = useSykmeldinger()

    if (!sykmeldinger || sykmeldinger.length > 0) {
        return null
    }

    return <GuidePanel illustration={veileder}>{parserWithReplace(tekst('ingen.sykmelding'))}</GuidePanel>
}
