import { BodyLong, BodyShort, HelpText } from '@navikt/ds-react'
import React, { useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import BekreftFeilLeder from './BekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string
    orgNavn?: string
}

const NarmesteLeder = ({
    orgnummer,
    orgNavn,
}: NaermesteLederContainerProps) => {
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

    if (!leder || !orgNavn) {
        return null
    }

    return (
        <Vis
            hvis={leder && orgNavn}
            render={() => (
                <>
                    <BodyShort className="leder__informasjon">
                        Din nærmeste leder er <strong>{leder?.navn}</strong>.
                    </BodyShort>
                    <div className="leder__handlinger">
                        <button className="lenke" onClick={() => toggleOpen()}>
                            <BodyShort as="span">Meld fra om endring</BodyShort>
                        </button>
                        <BekreftFeilLeder
                            open={open}
                            toggle={toggleOpen}
                            narmesteLeder={leder}
                            orgNavn={orgNavn}
                        />
                    </div>
                    <Vis
                        hvis={leder.arbeidsgiverForskutterer !== null}
                        render={() => (
                            <div className="leder__forskuttering">
                                <BodyShort>
                                    {tekst(
                                        `din-situasjon.arbeidsgiver-forskutterer${
                                            leder?.arbeidsgiverForskutterer
                                                ? ''
                                                : /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                  '-ikke'
                                        }` as any
                                    )}
                                </BodyShort>

                                <HelpText>
                                    <BodyLong>
                                        {tekst(
                                            'din-situasjon.forskuttering.hjelpetekst.tekst1'
                                        )}
                                    </BodyLong>
                                    <BodyLong>
                                        {tekst(
                                            'din-situasjon.forskuttering.hjelpetekst.tekst2'
                                        )}
                                    </BodyLong>
                                    <BodyLong>
                                        {tekst(
                                            'din-situasjon.forskuttering.hjelpetekst.tekst3'
                                        )}
                                    </BodyLong>
                                    <BodyLong>
                                        {tekst(
                                            'din-situasjon.forskuttering.hjelpetekst.tekst4'
                                        )}
                                    </BodyLong>
                                </HelpText>
                            </div>
                        )}
                    />
                </>
            )}
        />
    )
}

export default NarmesteLeder
