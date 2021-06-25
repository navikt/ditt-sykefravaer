import './tidlinje-utdrag.less'

import dayjs from 'dayjs'
import parser from 'html-react-parser'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Normaltekst } from 'nav-frontend-typografi'
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
import { SimpleSykmelding, Sykeforloep } from '../../types/sykeforloep'
import { Sykmelding } from '../../types/sykmelding'
import { hentArbeidssituasjon, senesteTom } from '../../utils/sykmeldingerUtils'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import Friskmelding from './Friskmelding'
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

// Henter startdato for nyeste sykeforløp
const hentStartdatoFraSykeforloep = (sykeforloep?: Sykeforloep[]) => {
    if (!sykeforloep || sykeforloep.length === 0) {
        return undefined
    }

    const startdato = sykeforloep.sort((s1, s2) =>
        dayjs(s2.oppfolgingsdato).unix() - dayjs(s1.oppfolgingsdato).unix()
    )[0].oppfolgingsdato

    return dayjs(startdato)
}

// Sjekker at bruker er syk nå og ikke har noen nye sykmeldinger
const arbeidsrettetOppfolgingSykmeldtInngangAktiv = (startdato: dayjs.Dayjs, sykeforloep?: Sykeforloep[], alleSykmeldinger?: Sykmelding[]) => {
    const iDag = dayjs()

    const finnAktuelleSykmeldinger = (sykmeldinger: SimpleSykmelding[]) => {
        return sykmeldinger.filter((s) =>
            iDag >= dayjs(s.fom) && iDag <= dayjs(s.tom)
        )
    }

    const aktueltSykeforloep = sykeforloep?.find((s) => dayjs(s.oppfolgingsdato) === startdato)
    if (!aktueltSykeforloep) return false

    const aktiveSykmeldinger = finnAktuelleSykmeldinger(aktueltSykeforloep.sykmeldinger)
    if (!aktiveSykmeldinger) return false

    const erArbeidsrettetOppfolgingSykmeldtInngangAktiv = aktiveSykmeldinger.length > 0 &&
        alleSykmeldinger?.find((s) => s.sykmeldingStatus.statusEvent === 'APEN') === undefined &&
        iDag.diff(startdato, 'weeks') >= 39 // TODO: Test

    return erArbeidsrettetOppfolgingSykmeldtInngangAktiv
}

// Lengde på sykeforløpet, Tvinger antall dager hvis det er ny sykmelding eller ingen sykmelding som er aktive
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
const getSykefravaerVarighet = (sykeforloep?: Sykeforloep[], sykmeldinger?: Sykmelding[]) => {
    const TRETTINI_UKER = 7 * 39
    const TVING_MER_ENN_39_UKER = 275
    const TVING_MINDRE_ENN_39_UKER = 272

    const startdato = hentStartdatoFraSykeforloep(sykeforloep)
    if (!startdato) return 0
    const erArbeidsrettetOppfolgingSykmeldtInngangAktiv = arbeidsrettetOppfolgingSykmeldtInngangAktiv(startdato, sykeforloep, sykmeldinger)

    const dagensDato = dayjs()
    const antallDager = dagensDato.diff(startdato, 'days') + 1   // TODO: Test at +1 er riktig

    return antallDager > 500
        ? antallDager
        : erArbeidsrettetOppfolgingSykmeldtInngangAktiv
            ? TVING_MER_ENN_39_UKER
            : antallDager > TRETTINI_UKER && erArbeidsrettetOppfolgingSykmeldtInngangAktiv === false
                ? TVING_MINDRE_ENN_39_UKER
                : antallDager
}

const skalViseUtdrag = (sykmeldinger?: Sykmelding[]) => {
    const ETT_DOGN = 60 * 60 * 24   // TODO: Obs, denne er nå sekunder og ikke ms, lag tester
    const SJU_DAGER = ETT_DOGN * 7

    if (!sykmeldinger) {
        return false
    }

    return sykmeldinger
        .filter((s) => {
            const tom = senesteTom(s.sykmeldingsperioder)
            return dayjs().unix() - tom.unix() < SJU_DAGER
        })
        .filter((s) =>
            [ 'APEN', 'BEKREFTET', 'SENDT' ].includes(s.sykmeldingStatus.statusEvent)
        ).length > 0
}

const getVisning = (sykeforloep?: Sykeforloep[], sykmeldinger?: Sykmelding[]): Visning => {
    const startdato = hentStartdatoFraSykeforloep(sykeforloep)
    if (!startdato || !sykmeldinger) {
        return 'VALGFRI'
    }

    const sykmeldingerForDetteSykeforloepet = sykmeldinger.filter((s) =>
        dayjs(s.syketilfelleStartDato).diff(startdato, 'days') === 0
    )

    const sykmeldingerForDetteSykeforloepetSomIkkeErNye = sykmeldingerForDetteSykeforloepet.filter((s) => {
        return s.sykmeldingStatus.statusEvent !== 'APEN'
    })

    const harBareNyeSykmeldinger = sykmeldingerForDetteSykeforloepet.filter((s) => {
        return s.sykmeldingStatus.statusEvent === 'APEN'
    }).length === sykmeldingerForDetteSykeforloepet.length

    if (harBareNyeSykmeldinger) {
        return 'VALGFRI'
    }

    const harBareSendteSykmeldinger = sykmeldingerForDetteSykeforloepetSomIkkeErNye.filter((s) =>
        s.sykmeldingStatus.statusEvent === 'SENDT' ||
        (s.sykmeldingStatus.statusEvent === 'BEKREFTET' && hentArbeidssituasjon(s) === 'ARBEIDSTAKER')
    ).length === sykmeldingerForDetteSykeforloepetSomIkkeErNye.length

    if (harBareSendteSykmeldinger) {
        return 'MED_ARBEIDSGIVER'
    }

    const harBareBekreftedeSykmeldinger = sykmeldingerForDetteSykeforloepetSomIkkeErNye.filter((s) => {
        return s.sykmeldingStatus.statusEvent === 'BEKREFTET' && hentArbeidssituasjon(s) !== 'ARBEIDSTAKER'
    }).length === sykmeldingerForDetteSykeforloepetSomIkkeErNye.length

    if (harBareBekreftedeSykmeldinger) {
        return 'UTEN_ARBEIDSGIVER'
    }

    return 'VALGFRI'
}

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

    // TODO: Legg inn i hvis for VisV2
    if (antallDager > 500) {
        return null
    }

    // TODO: Nå ligger tittel inne i Ekspanderbartpanel, intro tar da litt mindre plass og kan kanskje styles annerledes
    // TODO: Fix %ARBEIDSRETTETOPPFOLGING% i tekster
    // TODO: Når Tidslinjen er satt opp, lenke--tilTidslinje
    return (
        <Vis hvis={visInnhold}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Ekspanderbartpanel tittel={tekst(nokkelbase?.nokkel + '.tittel' as any)}
                apen={true}
                className="tidslinjeutdrag__container"
            >
                <VelgArbeidssituasjon
                    kanVelge={getVisning() === 'VALGFRI'}
                    setVisning={setVisning}
                />

                <div className="tidslinjeutdrag">
                    <img className="tidslinjeutdrag__bilde" src={bildeNokkelTilBilde(nokkelbase?.bilde)} alt="" />
                    <div className="tidslinjeutdrag__intro">
                        <Normaltekst className="tidslinjeutdrag__ingress">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {parser(tekst((nokkelbase?.nokkel + '.ingress') as any))}
                        </Normaltekst>
                    </div>
                </div>

                <Normaltekst>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {parser(tekst((nokkelbase?.nokkel + '.mer') as any))}
                </Normaltekst>
            </Ekspanderbartpanel>

            <Vis hvis={visning !== 'UTEN_ARBEIDSGIVER'}>
                <Friskmelding />
            </Vis>
        </Vis>
    )
}

export default TidslinjeUtdrag
