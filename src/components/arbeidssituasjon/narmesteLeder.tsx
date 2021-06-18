import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Normaltekst } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { tekst } from '../../utils/tekster'
import Vis from '../vis'
import BekreftFeilLeder from './bekreftFeilLeder'

interface NaermesteLederContainerProps {
    orgnummer: string,
    orgNavn?: string
}

const NarmesteLeder = ({ orgnummer, orgNavn }: NaermesteLederContainerProps) => {
    const { narmesteLedere } = useAppStore()

    const leder = narmesteLedere
        .filter((nl) => !nl.aktivTom && nl.navn)    // Aktiv og har navn på leder
        .find((nl) => nl.orgnummer === orgnummer)
    const [ open, setOpen ] = useState<boolean>(false)

    const toggleOpen = () => {
        setOpen(!open)
    }

    return (
        <Vis hvis={leder && orgNavn}>
            <Normaltekst className="leder__informasjon">
                Din nærmeste leder er <strong>{leder?.navn}</strong>.
            </Normaltekst>
            <Vis hvis={
                true // TODO: Finn ut hvor vi mottar avkreftet i fra
            }>
                <a className="lenke leder__meldFeil js-feil" onClick={() => toggleOpen()}>
                    <Normaltekst>Meld fra om endring</Normaltekst>
                </a>
                <BekreftFeilLeder
                    open={open}
                    toggle={toggleOpen}
                    narmesteLeder={leder!}
                    orgNavn={orgNavn!}
                />
            </Vis>
            <Vis hvis={leder?.arbeidsgiverForskutterer !== null}>
                <div className="leder__forskuttering">
                    <Normaltekst>{tekst(`din-situasjon.arbeidsgiver-forskutterer${leder?.arbeidsgiverForskutterer ? '' : '-ikke'}` as any)}</Normaltekst>
                    <Hjelpetekst>{tekst('din-situasjon.forskuttering.hjelpetekst.tekst')}</Hjelpetekst>
                </div>
            </Vis>
        </Vis>
    )
}

export default NarmesteLeder
