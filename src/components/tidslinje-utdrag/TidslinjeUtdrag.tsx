import './tidlinje-utdrag.less'

import parser from 'html-react-parser'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import React, { useEffect, useState } from 'react'

import Aktivitetsplan from '../../grafikk/tidslinjeutdrag/aktivitetsplan.svg'
import Aktivitestplikt from '../../grafikk/tidslinjeutdrag/aktivitetsplikt.svg'
import DialogmoteMedArbeidsgiver from '../../grafikk/tidslinjeutdrag/dialogmote-med-arbeidsgiver.svg'
import DialogmoteMedNav from '../../grafikk/tidslinjeutdrag/dialogmote-med-nav.svg'
import Langtidssykmeldt from '../../grafikk/tidslinjeutdrag/langtidssykmeldt.svg'
import Sluttfasen from '../../grafikk/tidslinjeutdrag/sluttfasen.svg'
import SnakkMedArbeidsgiver from '../../grafikk/tidslinjeutdrag/snakk-med-arbeidsgiver.svg'
import SykmeldtHvaNaa from '../../grafikk/tidslinjeutdrag/sykmeldt-hva-naa.svg'
import VurdertAktivitet from '../../grafikk/tidslinjeutdrag/vurdert-aktivitet.svg'
import useSykeforloep from '../../query-hooks/useSykeforloep'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import Friskmelding from './Friskmelding'
import {
    getSykefravaerVarighet,
    getVisning,
    skalViseUtdrag
} from './tidslinjeUtdragHjelefunksjoner'
import VelgArbeidssituasjon from './VelgArbeidssituasjon'

export type Visning = 'MED_ARBEIDSGIVER' | 'UTEN_ARBEIDSGIVER' | 'VALGFRI'

const teksterMedArbeidsgiver = [
    {
        fom: 0,
        tom: 16,
        nokkel: 'tidslinje.utdrag.sykmeldt-hva-naa.med-arbeidsgiver',
        bilde: 'sykmeldt-hva-naa.svg',
    }, {
        fom: 17,
        tom: 28,
        nokkel: 'tidslinje.utdrag.snakk-med-arbeidsgiver',
        bilde: 'snakk-med-arbeidsgiver.svg',
    }, {
        fom: 29,
        tom: 42,
        nokkel: 'tidslinje.utdrag.dialogmote-arbeidsgiver',
        bilde: 'dialogmote-med-arbeidsgiver.svg',
    }, {
        fom: 43,
        tom: 56,
        nokkel: 'tidslinje.utdrag.aktivitetskrav-med-arbeidsgiver',
        bilde: 'aktivitetsplikt.svg',
    }, {
        fom: 57,
        tom: 182,
        nokkel: 'tidslinje.utdrag.dialogmote-nav.med-arbeidsgiver',
        bilde: 'dialogmote-med-nav.svg',
    }, {
        fom: 183,
        tom: 273,
        nokkel: 'tidslinje.utdrag.langtidssykmeldt-med-arbeidsgiver',
        bilde: 'langtidssykmeldt.svg',
    }, {
        fom: 274,
        tom: 500,
        nokkel: 'tidslinje.utdrag.sluttfasen.med-arbeidsgiver-2',
        bilde: 'sluttfasen.svg',
    }
]

const teksterUtenArbeidsgiver = [
    {
        fom: 0,
        tom: 16,
        nokkel: 'tidslinje.utdrag.sykmeldt-hva-naa.uten-arbeidsgiver',
        bilde: 'sykmeldt-hva-naa.svg',
    }, {
        fom: 17,
        tom: 56,
        nokkel: 'tidslinje.utdrag.mulighet-for-aktivitet-uten-arbeidsgiver',
        bilde: 'vurdert-aktivitet.svg',
    }, {
        fom: 57,
        tom: 84,
        nokkel: 'tidslinje.utdrag.snakk-med-nav',
        bilde: 'dialogmote-med-nav.svg',
    }, {
        fom: 85,
        tom: 273,
        nokkel: 'tidslinje.utdrag.aktivitetsplan-uten-arbeidsgiver',
        bilde: 'aktivitetsplan.svg',
    }, {
        fom: 274,
        tom: 500,
        nokkel: 'tidslinje.utdrag.sluttfasen.uten-arbeidsgiver-2',
        bilde: 'sluttfasen.svg',
    }
]

const getNokkelBase = (visning: Visning, antallDager: number) => {
    const tekster = visning === 'UTEN_ARBEIDSGIVER'
        ? teksterUtenArbeidsgiver
        : teksterMedArbeidsgiver

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tekster.find((t) =>
        t.fom <= antallDager && t.tom >= antallDager
    )
}

const TidslinjeUtdrag = () => {
    const { data: sykmeldinger, isLoading: sykmeldingerIsLoading } = useSykmeldinger()
    const { data: sykeforloep, isLoading: sykeforloepIsLoading } = useSykeforloep()
    const [ visInnhold, setVisInnhold ] = useState<boolean>(false)
    const [ antallDager, setAntallDager ] = useState<number>(0)
    const [ visning, setVisning ] = useState<Visning>('VALGFRI')
    const nokkelbase = getNokkelBase(visning, antallDager)

    useEffect(() => {
        if (!sykmeldingerIsLoading && !sykeforloepIsLoading) {
            setVisInnhold(skalViseUtdrag(sykmeldinger))
            setAntallDager(getSykefravaerVarighet(sykeforloep, sykmeldinger))
            setVisning(getVisning(sykeforloep, sykmeldinger))
        }
        // eslint-disable-next-line
    }, [ sykmeldingerIsLoading, sykeforloepIsLoading ])

    const bildeNokkelTilBilde = (bildeNokkel?: string) => {
        switch (bildeNokkel) {
            case 'sykmeldt-hva-naa.svg':
                return SykmeldtHvaNaa
            case 'snakk-med-arbeidsgiver.svg':
                return SnakkMedArbeidsgiver
            case 'dialogmote-med-arbeidsgiver.svg':
                return DialogmoteMedArbeidsgiver
            case 'aktivitetsplikt.svg':
                return Aktivitestplikt
            case 'dialogmote-med-nav.svg':
                return DialogmoteMedNav
            case 'langtidssykmeldt.svg':
                return Langtidssykmeldt
            case 'sluttfasen.svg':
                return Sluttfasen
            case 'vurdert-aktivitet.svg':
                return VurdertAktivitet
            case 'aktivitetsplan.svg':
                return Aktivitetsplan
        }
    }

    // TODO: Nå ligger tittel inne i Ekspanderbartpanel, intro tar da litt mindre plass og kan kanskje styles annerledes
    // TODO: Når Tidslinjen er satt opp, lenke--tilTidslinje
    return (
        <Vis hvis={visInnhold && antallDager <= 500}
            render={() =>
                <>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Ekspanderbartpanel tittel={tekst(nokkelbase?.nokkel + '.tittel' as any)}
                        apen={true}
                        className="tidslinjeutdrag__container"
                    >
                        <VelgArbeidssituasjon
                            kanVelge={getVisning(sykeforloep, sykmeldinger) === 'VALGFRI'}
                            setVisning={setVisning}
                        />

                        <div className="tidslinjeutdrag">
                            <img className="tidslinjeutdrag__bilde" src={bildeNokkelTilBilde(nokkelbase?.bilde)} alt="" />
                            <div className="tidslinjeutdrag__intro">
                                <div className="typo-normal">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                        parser(tekst((nokkelbase?.nokkel + '.ingress') as any,
                                            { '%ARBEIDSRETTETOPPFOLGING%': '/syk/sykefravaer/snart-slutt-pa-sykepengene' }))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="typo-normal">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                parser(tekst((nokkelbase?.nokkel + '.mer') as any,
                                    { '%ARBEIDSRETTETOPPFOLGING%': '/syk/sykefravaer/snart-slutt-pa-sykepengene' }))
                            }
                        </div>
                    </Ekspanderbartpanel>

                    <Vis hvis={visning !== 'UTEN_ARBEIDSGIVER'}
                        render={() =>
                            <Friskmelding />
                        }
                    />
                </>
            }
        />
    )
}

export default TidslinjeUtdrag
