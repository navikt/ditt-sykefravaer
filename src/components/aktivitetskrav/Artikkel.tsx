import parser from 'html-react-parser'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import Image from 'next/image'
import React, { useState } from 'react'

import { tekst } from '../../utils/tekster'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import VelgArbeidssituasjon from '../velgArbeidssituasjon/VelgArbeidssituasjon'
import Vis from '../Vis'

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
                        <Image src="/syk/sykefravaer/static/med_arbeidsgiver.svg" width={24} height={24}
                            alt={tekst('aktivitetskrav-varsel.alt.MED_ARBEIDSGIVER')}
                        />
                    )}
                />
                <Vis hvis={visning === 'UTEN_ARBEIDSGIVER'}
                    render={() => (
                        <Image src="/syk/sykefravaer/static/uten_arbeidsgiver.svg" width={24} height={24}
                            alt={tekst('aktivitetskrav-varsel.alt.UTEN_ARBEIDSGIVER')}
                        />
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
