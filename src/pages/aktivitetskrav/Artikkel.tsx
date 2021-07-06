import dayjs from 'dayjs'
import parser from 'html-react-parser'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Radiofaner from '../../components/radiofaner/Radiofaner'
import { tekst } from '../../utils/tekster'

enum Arbeidssituasjoner {
    MED_ARBEIDSGIVER = 'MED_ARBEIDSGIVER',
    UTEN_ARBEIDSGIVER = 'UTEN_ARBEIDSGIVER'
}

interface Arbeidssituasjon {
    verdi: string;
    tittel: string;
}

const alternativer: Arbeidssituasjon[] = [
    {
        verdi: Arbeidssituasjoner.MED_ARBEIDSGIVER,
        tittel: 'Jeg har arbeidsgiver',
    },
    {
        verdi: Arbeidssituasjoner.UTEN_ARBEIDSGIVER,
        tittel: 'Jeg har ikke arbeidsgiver',
    }
]

interface ArtikkelProps {
    inntruffetdato: Date
}

const Artikkel = ({ inntruffetdato }: ArtikkelProps) => {
    const [ arbeidssituasjon, setArbeidssituasjon ] = useState('')

    return (
        <article className="panel">
            Artikkel {inntruffetdato}
            <header className="artikkel__header">
                <div className="artikkel__meta">
                    <Link to="/sykefravaer" className="tilbakelenke">Tilbake</Link>
                    <Normaltekst className="artikkel__meta__dato">
                        {dayjs(inntruffetdato).format('DD.MM.YYYY')}
                    </Normaltekst>
                </div>
                <Undertittel className="artikkel__tittel">
                    {tekst('aktivitetskrav-varsel.tittel')}
                </Undertittel>
                <Radiofaner valgtAlternativ={arbeidssituasjon}
                    changeHandler={(v) => {
                        setArbeidssituasjon(v)
                    }}
                    alternativer={alternativer}
                />
            </header>
            <Normaltekst className="artikkel__ingress">
                {tekst('aktivitetskrav-varsel.ingress')}
            </Normaltekst>
            <div className="artikkel__bilde">
                <img src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/svg/aktivitetsvarsel_${arbeidssituasjon}.svg`}
                    alt={`aktivitetskrav-varsel.alt.${arbeidssituasjon}`}
                />
            </div>
            <Normaltekst className="artikkel__innhold">
                {parser(
                    // eslint-disable-next-line
                    tekst(`aktivitetskrav-varsel.innhold.${arbeidssituasjon}` as any)
                )}
            </Normaltekst>
        </article>
    )
}

export default Artikkel
