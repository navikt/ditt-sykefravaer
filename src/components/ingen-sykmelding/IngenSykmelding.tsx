import parser from 'html-react-parser'
import Veilederpanel from 'nav-frontend-veilederpanel'
import React from 'react'

import { veileder } from '../../grafikk/Veileder'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'

export const IngenSykmelding = () => {
    const { data: sykmeldinger } = useSykmeldinger()

    if (!sykmeldinger || sykmeldinger.length > 0) {
        return null
    }

    return (
        <Veilederpanel svg={veileder}>
            {parser(tekst('ingen.sykmelding'))}
        </Veilederpanel>
    )
}
