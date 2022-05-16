import { BodyShort, Heading } from '@navikt/ds-react'
import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'

import Banner from '../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../components/brodsmuler/Brodsmuler'
import { Visning } from '../components/tidslinje-utdrag/TidslinjeUtdrag'
import { getVisning } from '../components/tidslinje-utdrag/tidslinjeUtdragHjelpefunksjoner'
import { Tidslinje } from '../components/tidslinjen/Tidslinje'
import VelgArbeidssituasjon from '../components/velgArbeidssituasjon/VelgArbeidssituasjon'
import useSykeforloep from '../query-hooks/useSykeforloep'
import useSykmeldinger from '../query-hooks/useSykmeldinger'
import { setBodyClass } from '../utils/setBodyClass'
import { tekst } from '../utils/tekster'

const brodsmuler: Brodsmule[] = [
    {
        tittel: 'Hva skjer under sykefraværet?',
        sti: '/tidslinjen',
        erKlikkbar: false,
    },
]

const Tidslinjen = () => {
    const { data: sykmeldinger, isLoading: sykmeldingerIsLoading } =
        useSykmeldinger()
    const { data: sykeforloep, isLoading: sykeforloepIsLoading } =
        useSykeforloep()
    const [visning, setVisning] = useState<Visning>('MED_ARBEIDSGIVER')

    useEffect(() => {
        setBodyClass('tidslinjen')
    }, [])

    useEffect(() => {
        if (!sykmeldingerIsLoading && !sykeforloepIsLoading) {
            const arbeidssituasjon: Visning = getVisning(
                sykeforloep,
                sykmeldinger
            )
            if (arbeidssituasjon !== 'VALGFRI') {
                setVisning(arbeidssituasjon)
            }
        }
        // eslint-disable-next-line
    }, [sykmeldingerIsLoading, sykeforloepIsLoading])

    return (
        <div>
            <Banner>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    {tekst('sidetittel.tidslinje')}
                </Heading>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <BodyShort>{tekst('tidslinje.introtekst')}</BodyShort>

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

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default Tidslinjen
