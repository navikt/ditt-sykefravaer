import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import React from 'react'
import Link from 'next/link'

import { logEvent } from '../umami/umami'

interface FellesLenkepanelProps {
    url?: string
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
            as={Link}
            className="mb-2"
            onClick={() => {
                if (props.url) {
                    logEvent('navigere', {
                        destinasjon: props.url,
                        lenketekst: props.tekst,
                        komponent: 'ditt sykefravær lenkepanel',
                    })
                }
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
