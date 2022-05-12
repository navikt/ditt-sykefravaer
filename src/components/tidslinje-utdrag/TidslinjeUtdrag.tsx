import { Accordion, Heading } from '@navikt/ds-react'
import parser from 'html-react-parser'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import useSykeforloep from '../../query-hooks/useSykeforloep'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { snartSluttUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import VelgArbeidssituasjon from '../velgArbeidssituasjon/VelgArbeidssituasjon'
import Vis from '../Vis'
import Friskmelding from './Friskmelding'
import {
    getSykefravaerVarighet,
    getVisning,
    skalViseUtdrag,
} from './tidslinjeUtdragHjelpefunksjoner'

export type Visning = 'MED_ARBEIDSGIVER' | 'UTEN_ARBEIDSGIVER' | 'VALGFRI'

const teksterMedArbeidsgiver = [
    {
        fom: Number.MIN_SAFE_INTEGER,
        tom: 16,
        nokkel: 'tidslinje.utdrag.sykmeldt-hva-naa.med-arbeidsgiver',
        bilde: 'sykmeldt-hva-naa.svg',
    },
    {
        fom: 17,
        tom: 28,
        nokkel: 'tidslinje.utdrag.snakk-med-arbeidsgiver',
        bilde: 'snakk-med-arbeidsgiver.svg',
    },
    {
        fom: 29,
        tom: 42,
        nokkel: 'tidslinje.utdrag.dialogmote-arbeidsgiver',
        bilde: 'dialogmote-med-arbeidsgiver.svg',
    },
    {
        fom: 43,
        tom: 56,
        nokkel: 'tidslinje.utdrag.aktivitetskrav-med-arbeidsgiver',
        bilde: 'aktivitetsplikt.svg',
    },
    {
        fom: 57,
        tom: 182,
        nokkel: 'tidslinje.utdrag.dialogmote-nav.med-arbeidsgiver',
        bilde: 'dialogmote-med-nav.svg',
    },
    {
        fom: 183,
        tom: 273,
        nokkel: 'tidslinje.utdrag.langtidssykmeldt-med-arbeidsgiver',
        bilde: 'langtidssykmeldt.svg',
    },
    {
        fom: 274,
        tom: 500,
        nokkel: 'tidslinje.utdrag.sluttfasen.med-arbeidsgiver-2',
        bilde: 'sluttfasen.svg',
    },
]

const teksterUtenArbeidsgiver = [
    {
        fom: Number.MIN_SAFE_INTEGER,
        tom: 16,
        nokkel: 'tidslinje.utdrag.sykmeldt-hva-naa.uten-arbeidsgiver',
        bilde: 'sykmeldt-hva-naa.svg',
    },
    {
        fom: 17,
        tom: 56,
        nokkel: 'tidslinje.utdrag.mulighet-for-aktivitet-uten-arbeidsgiver',
        bilde: 'vurdert-aktivitet.svg',
    },
    {
        fom: 57,
        tom: 84,
        nokkel: 'tidslinje.utdrag.snakk-med-nav',
        bilde: 'dialogmote-med-nav.svg',
    },
    {
        fom: 85,
        tom: 273,
        nokkel: 'tidslinje.utdrag.aktivitetsplan-uten-arbeidsgiver',
        bilde: 'aktivitetsplan.svg',
    },
    {
        fom: 274,
        tom: 500,
        nokkel: 'tidslinje.utdrag.sluttfasen.uten-arbeidsgiver-2',
        bilde: 'sluttfasen.svg',
    },
]

const getNokkelBase = (visning: Visning, antallDager: number) => {
    const tekster =
        visning === 'UTEN_ARBEIDSGIVER'
            ? teksterUtenArbeidsgiver
            : teksterMedArbeidsgiver

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tekster.find((t) => t.fom <= antallDager && t.tom >= antallDager)
}

const TidslinjeUtdrag = () => {
    const { data: sykmeldinger, isLoading: sykmeldingerIsLoading } =
        useSykmeldinger()
    const { data: sykeforloep, isLoading: sykeforloepIsLoading } =
        useSykeforloep()
    const [visInnhold, setVisInnhold] = useState<boolean>(false)
    const [antallDager, setAntallDager] = useState<number>(0)
    const [visning, setVisning] = useState<Visning>('VALGFRI')
    const nokkelbase = getNokkelBase(visning, antallDager)

    useEffect(() => {
        if (!sykmeldingerIsLoading && !sykeforloepIsLoading) {
            setVisInnhold(skalViseUtdrag(sykmeldinger))
            setAntallDager(getSykefravaerVarighet(sykeforloep, sykmeldinger))
            setVisning(getVisning(sykeforloep, sykmeldinger))
        }
        // eslint-disable-next-line
    }, [sykmeldingerIsLoading, sykeforloepIsLoading])

    const bildeNokkelTilBilde = (bildeNokkel?: string) => {
        return `/syk/sykefravaer/static/tidslinjeutdrag/${bildeNokkel}`
    }

    return (
        <Vis
            hvis={visInnhold && antallDager <= 500}
            render={() => (
                <>
                    <Accordion>
                        <Accordion.Item className="tidslinjeutdrag__container">
                            <Accordion.Header>
                                <div className="tidslinje__header">
                                    <VelgArbeidssituasjon
                                        kanVelge={
                                            getVisning(
                                                sykeforloep,
                                                sykmeldinger
                                            ) === 'VALGFRI'
                                        }
                                        setVisning={setVisning}
                                        medHjelpetekst={false}
                                    />

                                    <div className="tidslinjeutdrag">
                                        <img
                                            className="tidslinjeutdrag__bilde"
                                            alt=""
                                            src={bildeNokkelTilBilde(
                                                nokkelbase?.bilde
                                            )}
                                        />
                                        <div className="tidslinjeutdrag__intro">
                                            <Heading
                                                size="small"
                                                level="2"
                                                className="utdrag_tittel"
                                            >
                                                {
                                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                    tekst(
                                                        (nokkelbase?.nokkel +
                                                            '.tittel') as any
                                                    )
                                                }
                                            </Heading>
                                            <div className="utdrag_ingress">
                                                {
                                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                    parser(
                                                        tekst(
                                                            (nokkelbase?.nokkel +
                                                                '.ingress') as any,
                                                            {
                                                                '%ARBEIDSRETTETOPPFOLGING%':
                                                                    snartSluttUrl(),
                                                            }
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Header>

                            <Accordion.Content>
                                <div className="utdrag_mer">
                                    {
                                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                        parser(
                                            tekst(
                                                (nokkelbase?.nokkel +
                                                    '.mer') as any,
                                                {
                                                    '%ARBEIDSRETTETOPPFOLGING%':
                                                        snartSluttUrl(),
                                                }
                                            )
                                        )
                                    }
                                </div>
                                <Link href="/tidslinjen">
                                    <a className="navds-link lenke--tilTidslinje">
                                        {tekst(
                                            'tidslinje.utdrag.lenke-til-tidslinje'
                                        )}
                                    </a>
                                </Link>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>

                    <Vis
                        hvis={visning !== 'UTEN_ARBEIDSGIVER'}
                        render={() => <Friskmelding />}
                    />
                </>
            )}
        />
    )
}

export default TidslinjeUtdrag
