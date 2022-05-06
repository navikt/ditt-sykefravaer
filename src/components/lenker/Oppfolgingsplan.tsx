import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import React from 'react'

import { oppfolgingsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

const Oppfolgingsplan = () => {
    return (
        <LinkPanel href={oppfolgingsplanUrl()} border={true}>
            <div className="lenkeikon">
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
            </div>
            <div>
                <Heading size="small" level="3">
                    {tekst('lenker.oppfolgingsplan')}
                </Heading>
                <BodyShort>
                    {tekst('lenker.oppfolgingsplan.undertekst')}
                </BodyShort>
            </div>
        </LinkPanel>
    )
}

export default Oppfolgingsplan
