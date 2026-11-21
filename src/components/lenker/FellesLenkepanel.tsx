import { LinkCard } from '@navikt/ds-react'
import React from 'react'
import NextLink from 'next/link'

import { logEvent } from '../umami/umami'

interface FellesLenkepanelProps {
    url: string
    ikon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>
    tekst: string
    undertekst?: string
}

export const FellesLenkepanel = (props: FellesLenkepanelProps) => {
    return (
        <LinkCard className="mb-2">
            <LinkCard.Icon>
                <props.ikon aria-hidden={true} height="30px" width="30px" />
            </LinkCard.Icon>
            <LinkCard.Title as="h2">
                <LinkCard.Anchor asChild>
                    <NextLink
                        href={props.url}
                        onClick={() => {
                            logEvent('navigere', {
                                destinasjon: props.url,
                                lenketekst: props.tekst,
                                komponent: 'ditt sykefravær lenkepanel',
                            })
                        }}
                    >
                        {props.tekst}
                    </NextLink>
                </LinkCard.Anchor>
            </LinkCard.Title>
            {props.undertekst && <LinkCard.Description>{props.undertekst}</LinkCard.Description>}
        </LinkCard>
    )
}
