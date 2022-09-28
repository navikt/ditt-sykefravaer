import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import React from 'react'

import { logEvent } from '../amplitude/amplitude'

interface FellesLenkepanelProps {
    url: string
    ikon: React.ReactNode
    tekst: string
    undertekst?: string
}

export const FellesLenkepanel = (props: FellesLenkepanelProps) => {
    const heading = () => {
        if (props.undertekst) {
            return (
                <div className="bred-tekst-lenkepanel">
                    <Heading size="small" level="3">
                        {props.tekst}
                    </Heading>
                    <BodyShort>{props.undertekst}</BodyShort>
                </div>
            )
        }
        return (
            <Heading size="small" level="3">
                {props.tekst}
            </Heading>
        )
    }
    return (
        <LinkPanel
            onClick={(e) => {
                e.preventDefault()
                logEvent('navigere', {
                    destinasjon: props.url,
                    lenketekst: props.tekst,
                    komponent: 'ditt sykefravær lenkepanel',
                })
                window.location.href = props.url
            }}
            href={props.url}
            border={true}
        >
            <div className="lenkeikon">{props.ikon}</div>
            {heading()}
        </LinkPanel>
    )
}
