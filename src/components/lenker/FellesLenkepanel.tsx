import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import React from 'react'

import { logEvent } from '../amplitude/amplitude'

interface FellesLenkepanelProps {
    url: string
    ikon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>
    tekst: string
    undertekst?: string
}

export const FellesLenkepanel = (props: FellesLenkepanelProps) => {
    const heading = () => {
        if (props.undertekst) {
            return (
                <div>
                    <Heading size="small" level="2">
                        {props.tekst}
                    </Heading>
                    <BodyShort>{props.undertekst}</BodyShort>
                </div>
            )
        }
        return (
            <Heading size="small" level="2">
                {props.tekst}
            </Heading>
        )
    }
    return (
        <LinkPanel
            className="mb-2"
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
            <div className="flex">
                <div className="ml-0.5 mr-4 flex items-center">
                    <props.ikon aria-hidden={true} height="30px" width="30px" />
                </div>
                {heading()}
            </div>
        </LinkPanel>
    )
}
