import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Normaltekst } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import BekreftFeilLeder from './BekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string,
    orgNavn?: string
}

const NarmesteLeder = ({ orgnummer, orgNavn }: NaermesteLederContainerProps) => {
    const { data: narmesteLedere } = useNarmesteledere()
    const [ open, setOpen ] = useState<boolean>(false)

    if (!narmesteLedere) {
        return null
    }
    const leder = narmesteLedere
        .filter((nl) => !nl.aktivTom && nl.navn)    // Aktiv og har navn på leder
        .find((nl) => nl.orgnummer === orgnummer)

    const toggleOpen = () => {
        setOpen(!open)
    }
    if (!leder || !orgNavn) {
        return null
    }
    return (
        <Vis hvis={leder && orgNavn}
            render={() =>
                <>
                    <Normaltekst className="leder__informasjon">
                        Din nærmeste leder er <strong>{leder?.navn}</strong>.
                    </Normaltekst>
                    <div className="leder__handlinger">
                        <button className="lenke" onClick={() => toggleOpen()}>
                            <Normaltekst>Meld fra om endring</Normaltekst>
                        </button>
                        <BekreftFeilLeder
                            open={open}
                            toggle={toggleOpen}
                            narmesteLeder={leder}
                            orgNavn={orgNavn}
                        />
                    </div>
                    <Vis hvis={leder.arbeidsgiverForskutterer !== null}
                        render={() =>
                            <div className="leder__forskuttering">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <Normaltekst>{tekst(`din-situasjon.arbeidsgiver-forskutterer${leder?.arbeidsgiverForskutterer ? '' : '-ikke'}` as any)}</Normaltekst>
                                <Hjelpetekst>
                                    <Normaltekst>{tekst('din-situasjon.forskuttering.hjelpetekst.tekst1')}</Normaltekst>
                                    <Normaltekst>{tekst('din-situasjon.forskuttering.hjelpetekst.tekst2')}</Normaltekst>
                                    <Normaltekst>{tekst('din-situasjon.forskuttering.hjelpetekst.tekst3')}</Normaltekst>
                                    <Normaltekst>{tekst('din-situasjon.forskuttering.hjelpetekst.tekst4')}</Normaltekst>
                                </Hjelpetekst>
                            </div>
                        }
                    />
                </>
            }
        />
    )
}

export default NarmesteLeder
