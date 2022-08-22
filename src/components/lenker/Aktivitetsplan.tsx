import React from 'react'

import { aktivitetsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { FellesLenkepanel } from './FellesLenkepanel'

const Aktivitetsplan = () => {
    const ikon = (
        <svg width="32" height="30" viewBox="0 0 32 30" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#3E3832" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.333 16.667H10L4.667 22v-5.333h-4v-16H26v8.666" />
                <path d="M15.333 23.333h7.334l6 5.334v-5.334h2.666V12.667h-16z" />
            </g>
        </svg>
    )

    return (
        <FellesLenkepanel
            ikon={ikon}
            url={aktivitetsplanUrl()}
            tekst={tekst('lenker.aktivitetsplan')}
            undertekst={tekst('lenker.aktivitetsplan.undertekst')}
        />
    )
}

export default Aktivitetsplan
