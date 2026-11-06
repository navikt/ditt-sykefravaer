import { BodyShort, Link } from '@navikt/ds-react'
import React, { useState } from 'react'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import useNarmesteledere, { useAvkreftedeLedere } from '../../hooks/useNarmesteledere'
import { NarmesteLeder as NarmesteLederType } from '../../types/narmesteLeder'
import { tekst } from '../../utils/tekster'

import BekreftFeilLeder from './BekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string
    orgNavn?: string
}

const NarmesteLeder = ({ orgnummer, orgNavn }: NaermesteLederContainerProps) => {
    const { data: narmesteLedere } = useNarmesteledere()
    const avkreftede = useAvkreftedeLedere()

    if (!narmesteLedere) {
        return null
    }
    const leder =
        narmesteLedere.find((nl) => nl.orgnummer === orgnummer && nl.navn) ??
        narmesteLedere.find((nl) => nl.orgnummer === orgnummer)

    if (!orgNavn) {
        return null
    }

    const venter = avkreftede.some((nl) => nl.orgnummer === orgnummer)
    const ventetekst = 'Vi har bedt om å fjerne en nærmeste leder. Vi kan ikke bekrefte at endringen er fullført ennå.'

    if (!leder) {
        return (
            <BodyShort spacing role={venter ? 'status' : undefined}>
                {venter ? ventetekst : tekst('din-situasjon.ingen-nærmesteleder')}
            </BodyShort>
        )
    }

    return (
        <>
            {venter && (
                <BodyShort spacing role="status">
                    {ventetekst}
                </BodyShort>
            )}
            <LederVisning key={leder.id} leder={leder} orgNavn={orgNavn} />
        </>
    )
}

function LederVisning({ leder, orgNavn }: { leder: NarmesteLederType; orgNavn: string }) {
    const [open, setOpen] = useState(false)
    const lukk = () => setOpen(false)

    return (
        <>
            {leder.navn ? (
                <BodyShort spacing>
                    {parserWithReplace(
                        tekst('din-situasjon.nærmesteleder', {
                            '%ARBEIDSGIVER%': leder.navn,
                        }),
                    )}
                </BodyShort>
            ) : (
                <BodyShort spacing>
                    Arbeidsgiveren din har registrert en nærmeste leder, men navnet er ikke tilgjengelig.
                </BodyShort>
            )}

            <Link as="button" onClick={() => setOpen(true)}>
                Meld fra om endring
            </Link>
            <BekreftFeilLeder open={open} toggle={lukk} narmesteLeder={leder} orgNavn={orgNavn} />
        </>
    )
}

export default NarmesteLeder
