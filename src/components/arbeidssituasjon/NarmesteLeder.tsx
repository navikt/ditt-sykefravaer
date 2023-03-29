import { BodyShort, Link } from '@navikt/ds-react'
import React, { useState } from 'react'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import useNarmesteledere from '../../hooks/useNarmesteledere'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

import BekreftFeilLeder from './BekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string
    orgNavn?: string
}

const NarmesteLeder = ({ orgnummer, orgNavn }: NaermesteLederContainerProps) => {
    const { data: narmesteLedere } = useNarmesteledere()
    const [open, setOpen] = useState<boolean>(false)

    if (!narmesteLedere) {
        return null
    }
    const leder = narmesteLedere
        .filter((nl) => !nl.aktivTom && nl.navn) // Aktiv og har navn på leder
        .find((nl) => nl.orgnummer === orgnummer)

    const toggleOpen = () => {
        setOpen(!open)
    }

    return (
        <>
            <Vis
                hvis={leder && orgNavn}
                render={() => (
                    <>
                        <Vis
                            hvis={leder!.navn}
                            render={() => (
                                <BodyShort spacing>
                                    {parserWithReplace(
                                        tekst('din-situasjon.nærmesteleder', {
                                            '%ARBEIDSGIVER%': leder!.navn!,
                                        }),
                                    )}
                                </BodyShort>
                            )}
                        />

                        <Link as={'button'} onClick={() => toggleOpen()}>
                            Meld fra om endring
                        </Link>
                        <BekreftFeilLeder open={open} toggle={toggleOpen} narmesteLeder={leder!} orgNavn={orgNavn!} />
                    </>
                )}
            />
        </>
    )
}

export default NarmesteLeder
