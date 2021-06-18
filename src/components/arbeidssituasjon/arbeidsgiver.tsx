import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { tekst } from '../../utils/tekster'
import NarmesteLeder from './narmesteLeder'

interface ArbeidsgiverProps {
    orgnummer: string
}

const Arbeidsgiver = ({ orgnummer }: ArbeidsgiverProps) => {
    const { sykmeldinger  } = useAppStore()

    const orgNavn = sykmeldinger
        .find((syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer &&
            syk.sykmeldingStatus.arbeidsgiver?.orgNavn
        )
        ?.sykmeldingStatus.arbeidsgiver!.orgNavn

    return (
        <div className="situasjon__innhold">
            <Normaltekst>{tekst('din-situasjon.ansatt') + orgNavn}</Normaltekst>
            <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
        </div>
    )
}

export default Arbeidsgiver
