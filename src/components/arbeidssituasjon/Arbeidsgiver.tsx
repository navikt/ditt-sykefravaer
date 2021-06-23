import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverProps {
    orgnummer: string
}

const Arbeidsgiver = ({ orgnummer }: ArbeidsgiverProps) => {
    const { data: sykmeldinger } = useSykmeldinger()
    if (!sykmeldinger) {
        return null
    }

    const orgNavn = sykmeldinger
        .find((syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer &&
            syk.sykmeldingStatus.arbeidsgiver?.orgNavn
        )
        ?.sykmeldingStatus.arbeidsgiver?.orgNavn

    return (
        <div className="situasjon__innhold">
            <Normaltekst>{tekst('din-situasjon.ansatt') + orgNavn}</Normaltekst>
            <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
        </div>
    )
}

export default Arbeidsgiver
