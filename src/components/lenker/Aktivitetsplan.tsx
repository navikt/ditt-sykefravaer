import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import React from 'react'

import { aktivitetsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

const Aktivitetsplan = () => {
    return (
        <LinkPanel href={aktivitetsplanUrl()} border={true}>
            <div className="lenkeikon">
                <svg
                    width="32"
                    height="30"
                    viewBox="0 0 32 30"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        stroke="#3E3832"
                        fill="none"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M11.333 16.667H10L4.667 22v-5.333h-4v-16H26v8.666" />
                        <path d="M15.333 23.333h7.334l6 5.334v-5.334h2.666V12.667h-16z" />
                    </g>
                </svg>
            </div>
            <div>
                <Heading size="small" level="3">
                    {tekst('lenker.aktivitetsplan')}
                </Heading>
                <BodyShort>
                    {tekst('lenker.aktivitetsplan.undertekst')}
                </BodyShort>
            </div>
        </LinkPanel>
    )
}

export default Aktivitetsplan
