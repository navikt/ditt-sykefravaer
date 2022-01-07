import parser from 'html-react-parser'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import { Visning } from '../../components/tidslinje-utdrag/TidslinjeUtdrag'
import VelgArbeidssituasjon from '../../components/velgArbeidssituasjon/VelgArbeidssituasjon'
import Vis from '../../components/Vis'
import { tekst } from '../../utils/tekster'
import medArbeidsgiver from './med_arbeidsgiver.svg'
import utenArbeidsgiver from './uten_arbeidsgiver.svg'

const Artikkel = () => {
    const [ visning, setVisning ] = useState<Visning>('MED_ARBEIDSGIVER')

    return (
        <article className="artikkel">
            <header className="artikkel__header">
                <Undertittel className="artikkel__tittel">
                    {tekst('aktivitetskrav-varsel.tittel')}
                </Undertittel>
                <VelgArbeidssituasjon kanVelge={true} setVisning={setVisning} medHjelpetekst={false} />
            </header>
            <Normaltekst className="artikkel__ingress">
                {tekst('aktivitetskrav-varsel.ingress')}
            </Normaltekst>
            <div className="artikkel__bilde">
                <Vis hvis={visning === 'MED_ARBEIDSGIVER'}
                    render={() => (
                        <img src={medArbeidsgiver} alt={tekst('aktivitetskrav-varsel.alt.MED_ARBEIDSGIVER')} />
                    )}
                />
                <Vis hvis={visning === 'UTEN_ARBEIDSGIVER'}
                    render={() => (
                        <img src={utenArbeidsgiver} alt={tekst('aktivitetskrav-varsel.alt.UTEN_ARBEIDSGIVER')} />
                    )}
                />
            </div>
            <Normaltekst tag="div" className="artikkel__innhold">
                {parser(
                    // eslint-disable-next-line
                    tekst(`aktivitetskrav-varsel.innhold.${visning}` as any)
                )}
            </Normaltekst>
        </article>
    )
}

export default Artikkel
