import { BodyShort } from '@navikt/ds-react'
import parser from 'html-react-parser'
import React, { useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
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
                                <BodyShort className="leder__informasjon">
                                    {parser(
                                        tekst('din-situasjon.nærmesteleder', {
                                            '%ARBEIDSGIVER%': leder!.navn!,
                                        })
                                    )}
                                </BodyShort>
                            )}
                        />
                        <div className="leder__handlinger">
                            <button className="lenke" onClick={() => toggleOpen()}>
                                <BodyShort spacing as="span">
                                    Meld fra om endring
                                </BodyShort>
                            </button>
                            <BekreftFeilLeder
                                open={open}
                                toggle={toggleOpen}
                                narmesteLeder={leder!}
                                orgNavn={orgNavn!}
                            />
                        </div>
                    </>
                )}
            />
            <Vis
                hvis={!leder || !orgNavn}
                render={() => <BodyShort spacing>{tekst('din-situasjon.arbeidsgiver-endret-nærmesteleder')}</BodyShort>}
            />
        </>
    )
}

export default NarmesteLeder
