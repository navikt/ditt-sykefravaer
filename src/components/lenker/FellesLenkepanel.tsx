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
                <div>
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
            className={'mb-2'}
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
            <div className={'flex w-72'}>
                <div className="my-4 mr-4 ml-0.5 flex ">{props.ikon}</div>
                {heading()}
            </div>
        </LinkPanel>
    )
}
