import React from 'react'

import { oppfolgingsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { FellesLenkepanel } from './FellesLenkepanel'

const Oppfolgingsplan = () => {
    const ikon = (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                stroke="#000"
                fill="none"
                fillRule="evenodd"
                strokeLinejoin="round"
            >
                <g strokeLinecap="round">
                    <path d="M18 19.333h-6.667L6 24.667v-5.334H.667V.667h28V12M21.333 30l-4.666 1.333L18 26.667l10-10L31.333 20z" />
                </g>
                <path d="M25.333 19.333l3.334 3.334" />
                <path d="M18 26.667L21.333 30" strokeLinecap="round" />
            </g>
        </svg>
    )

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={oppfolgingsplanUrl()}
            tekst={tekst('lenker.oppfolgingsplan')}
            undertekst={tekst('lenker.oppfolgingsplan.undertekst')}
        />
    )
}

export default Oppfolgingsplan
