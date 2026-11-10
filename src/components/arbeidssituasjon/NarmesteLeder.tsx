import { BodyShort, Link } from '@navikt/ds-react'
import React, { useState } from 'react'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import useNarmesteledere from '../../hooks/useNarmesteledere'
import { NarmesteLeder as NarmesteLederType } from '../../types/narmesteLeder'
import { tekst } from '../../utils/tekster'

import BekreftFeilLeder from './BekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string
    orgNavn?: string
}

const NarmesteLeder = ({ orgnummer, orgNavn }: NaermesteLederContainerProps) => {
    const { data: narmesteLedere } = useNarmesteledere()

    if (!narmesteLedere) {
        return null
    }
    const leder = narmesteLedere.find((nl) => nl.orgnummer === orgnummer)

    if (!orgNavn) {
        return null
    }

    if (!leder || !leder.navn.trim()) {
        return <BodyShort spacing>{tekst('din-situasjon.ingen-nærmesteleder')}</BodyShort>
    }

    return <LederVisning key={leder.id} leder={leder} orgNavn={orgNavn} />
}

function LederVisning({ leder, orgNavn }: { leder: NarmesteLederType; orgNavn: string }) {
    const [open, setOpen] = useState(false)
    const lukk = () => setOpen(false)

    return (
        <>
            <BodyShort spacing>
                {parserWithReplace(
                    tekst('din-situasjon.nærmesteleder', {
                        '%ARBEIDSGIVER%': leder.navn,
                    }),
                )}
            </BodyShort>

            <Link as="button" onClick={() => setOpen(true)}>
                Meld fra om endring
            </Link>
            <BekreftFeilLeder open={open} toggle={lukk} narmesteLeder={leder} orgNavn={orgNavn} />
        </>
    )
}

export default NarmesteLeder
