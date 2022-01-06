import { Normaltekst, Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import useSykeforloep from '../../query-hooks/useSykeforloep'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import setBodyClass from '../../utils/setBodyClass'
import { tekst } from '../../utils/tekster'
import Banner from '../banner/Banner'
import Brodsmuler, { Brodsmule } from '../brodsmuler/Brodsmuler'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import { getVisning } from '../tidslinje-utdrag/tidslinjeUtdragHjelpefunksjoner'
import VelgArbeidssituasjon from '../velgArbeidssituasjon/VelgArbeidssituasjon'
import { Tidslinje } from './Tidslinje'

const brodsmuler: Brodsmule[] = [
    { tittel: 'Hva skjer under sykefraværet?', sti: '/tidslinjen', erKlikkbar: false }
]

const Tidslinjen = () => {
    const { data: sykmeldinger, isLoading: sykmeldingerIsLoading } = useSykmeldinger()
    const { data: sykeforloep, isLoading: sykeforloepIsLoading } = useSykeforloep()
    const [ visning, setVisning ] = useState<Visning>('MED_ARBEIDSGIVER')

    useEffect(() => {
        setBodyClass('tidslinjen')
    }, [])

    useEffect(() => {
        if (!sykmeldingerIsLoading && !sykeforloepIsLoading) {
            const arbeidssituasjon: Visning = getVisning(sykeforloep, sykmeldinger)
            if (arbeidssituasjon !== 'VALGFRI') {
                setVisning(arbeidssituasjon)
            }
        }
        // eslint-disable-next-line
    }, [ sykmeldingerIsLoading, sykeforloepIsLoading ])

    return (
        <div>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('sidetittel.tidslinje')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Normaltekst>
                    {tekst('tidslinje.introtekst')}
                </Normaltekst>

                <VelgArbeidssituasjon
                    kanVelge={true}
                    setVisning={setVisning}
                    medHjelpetekst={true}
                />

                <Tidslinje visning={visning} />
            </div>
        </div>
    )
}

export default Tidslinjen
