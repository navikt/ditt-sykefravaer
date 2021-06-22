import './tidlinje-utdrag.less'

import parser from 'html-react-parser'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Normaltekst } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import Aktivitetsplan from '../../grafikk/tidslinjeutdrag/aktivitetsplan.svg'
import Aktivitestplikt from '../../grafikk/tidslinjeutdrag/aktivitetsplikt.svg'
import DialogmoteMedArbeidsgiver from '../../grafikk/tidslinjeutdrag/dialogmote-med-arbeidsgiver.svg'
import DialogmoteMedNav from '../../grafikk/tidslinjeutdrag/dialogmote-med-nav.svg'
import Langtidssykmeldt from '../../grafikk/tidslinjeutdrag/langtidssykmeldt.svg'
import Sluttfasen from '../../grafikk/tidslinjeutdrag/sluttfasen.svg'
import SnakkMedArbeidsgiver from '../../grafikk/tidslinjeutdrag/snakk-med-arbeidsgiver.svg'
import SykmeldtHvaNaa from '../../grafikk/tidslinjeutdrag/sykmeldt-hva-naa.svg'
import VurdertAktivitet from '../../grafikk/tidslinjeutdrag/vurdert-aktivitet.svg'
import { tekst } from '../../utils/tekster'
import Vis from '../vis'

type Visning = 'MED_ARBEIDSGIVER' | 'UTEN_ARBEIDSGIVER' | 'VALGFRI'

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

const TidslinjeUtdrag = () => {

    const getSykefravaerVarighet = () => {
        // Finn lengden på sykefraværet
        // Skal ikke vise noe hvis dager er mer enn 500
        // Sjekk TVING_MER_ENN_39_UKER
        // Sjekk TVING_MINDRE_ENN_39_UKER
        return 0
    }

    const skalViseUtdrag = () => {
        // Skal bare vise hvis senestes tom er frem i tid eller ikke eldre enn 7 dager
        return false
    }

    const getVisning = (): Visning => {
        // !startdato VALGFRI
        // harBareNyeSykmeldinger VALGFRI
        // harBareSendteSykmeldinger MED_ARBEIDSGIVER
        // harBareBekreftedeSykmeldinger UTEN_ARBEIDSGIVER
        // default VALGFRI
        return 'MED_ARBEIDSGIVER'
    }

    const getNokkelBase = (visning: Visning, antallDager: number) => {
        const tekster = visning === 'UTEN_ARBEIDSGIVER'
            ? teksterUtenArbeidsgiver
            : teksterMedArbeidsgiver

        return tekster.find((t) =>
            t.fom <= antallDager && t.tom >= antallDager
        )
    }

    const bildeNokkelTilBilde = (bildeNokkel: string) => {
        switch (bildeNokkel) {
            case 'sykmeldt-hva-naa.svg': return SykmeldtHvaNaa
            case 'snakk-med-arbeidsgiver.svg': return SnakkMedArbeidsgiver
            case 'dialogmote-med-arbeidsgiver.svg': return DialogmoteMedArbeidsgiver
            case 'aktivitetsplikt.svg': return Aktivitestplikt
            case 'dialogmote-med-nav.svg': return DialogmoteMedNav
            case 'langtidssykmeldt.svg': return Langtidssykmeldt
            case 'sluttfasen.svg': return Sluttfasen
            case 'vurdert-aktivitet.svg': return VurdertAktivitet
            case 'aktivitetsplan.svg': return Aktivitetsplan
        }
    }

    const [ visInnhold, setVisInnhold ] = useState<boolean>(skalViseUtdrag())
    const [ antallDager, setAntallDager ] = useState<number>(getSykefravaerVarighet())
    const [ visning, setVisning ] = useState<Visning>(getVisning())
    const nokkelbase = getNokkelBase(visning, antallDager)!

    // TODO: Nå ligger tittel inne i Ekspanderbartpanel, intro tar da litt mindre plass og kan kanskje styles annerledes
    // TODO: Fix %ARBEIDSRETTETOPPFOLGING% i tekster
    return (
        <div>
            {'Vis tidslinje utdrag: '}
            <input type="radio" checked={visInnhold} onClick={() => setVisInnhold(!visInnhold)} />

            <Vis hvis={visInnhold}>
                {' Syk '}
                <input type="number" defaultValue={antallDager} onChange={(e) => setAntallDager(Number(e.target.value))} />
                {' dager '}
                <select defaultValue={visning} onChange={(e) => {
                    console.log('e', e) // eslint-disable-line
                    setVisning(e.currentTarget.value as Visning)
                }}>
                    <option value="MED_ARBEIDSGIVER">MED_ARBEIDSGIVER</option>
                    <option value="UTEN_ARBEIDSGIVER">UTEN_ARBEIDSGIVER</option>
                    <option value="VALGFRI">VALGFRI</option>
                </select>

                <Ekspanderbartpanel
                    tittel={tekst(nokkelbase.nokkel + '.tittel' as any)}
                    apen={true}
                    className="tidslinjeutdrag__container"
                >
                    <div className="tidslinjeutdrag">
                        <img className="tidslinjeutdrag__bilde" src={bildeNokkelTilBilde(nokkelbase.bilde)} />
                        <div className="tidslinjeutdrag__intro">
                            <Normaltekst className="tidslinjeutdrag__ingress">
                                {parser(tekst((nokkelbase.nokkel + '.ingress') as any))}
                            </Normaltekst>
                        </div>
                    </div>

                    <Normaltekst>
                        {parser(tekst((nokkelbase.nokkel + '.mer') as any))}
                    </Normaltekst>
                </Ekspanderbartpanel>
            </Vis>
        </div>
    )
}

export default TidslinjeUtdrag
