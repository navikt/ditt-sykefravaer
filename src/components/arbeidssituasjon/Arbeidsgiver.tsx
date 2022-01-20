import { Normaltekst } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import NarmesteLeder from './NarmesteLeder'
import { Sykmelding } from '../../types/sykmelding'

interface ArbeidsgiverProps {
    orgnummer: string
}

const Arbeidsgiver = ({ orgnummer }: ArbeidsgiverProps) => {
    const [ meldinger, setMeldinger ] = useState<Sykmelding[]>()
    const [ navn, setNavn ] = useState<string>('')
    const { data: sykmeldinger } = useSykmeldinger()

    useEffect(() => {
        const orgNavn = sykmeldinger!
            .find((syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer &&
                syk.sykmeldingStatus.arbeidsgiver?.orgNavn
            )
            ?.sykmeldingStatus.arbeidsgiver?.orgNavn
        setNavn(orgNavn!)
        setMeldinger(sykmeldinger!)
    }, [ orgnummer, sykmeldinger ])

    if (!meldinger) return null

    return (
        <div className="situasjon__innhold">
            <Normaltekst>{tekst('din-situasjon.ansatt') + navn}</Normaltekst>
            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
        </div>
    )
}

export default Arbeidsgiver
