import parser from 'html-react-parser'
import Veilederpanel from 'nav-frontend-veilederpanel'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { veileder } from '../../grafikk/veileder'
import { tekst } from '../../utils/tekster'


export const IngenSykmelding = () => {
    const { sykmeldinger } = useAppStore()
    if (sykmeldinger.length > 0) {
        return null
    }
    return (
        <Veilederpanel svg={veileder}>
            {parser(tekst('ingen.sykmelding'))}
        </Veilederpanel>
    )
}

