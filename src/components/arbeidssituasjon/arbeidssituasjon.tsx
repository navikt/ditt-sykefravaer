import './arbeidssituasjon.less'

import dayjs from 'dayjs'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import ArbeidsgiverIkon from '../../grafikk/arbeidsgiver.svg'
import ArbeidssituasjonIkon from '../../grafikk/arbeidssituasjon.svg'
import SelvstendigFrilanserIkon from '../../grafikk/id-kort.svg'
import AnnenArbeidssituasjonIkon from '../../grafikk/skilt.svg'
import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { RSArbeidssituasjonType } from '../../types/rs-types/rs-arbeidssituasjon'
import { Periode, Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import Vis from '../vis'
import Arbeidsgiver from './arbeidsgiver'

const hentArbeidssituasjon = (sykmelding: Sykmelding) => {
    return sykmelding.sykmeldingStatus.sporsmalOgSvarListe?.find(s => s.shortName === 'ARBEIDSSITUASJON')?.svar?.svar
}

const selectSykmeldingerYngreEnnTreMaaneder = (sykmeldinger: Sykmelding[]) => {
    const treMndSiden = dayjs().subtract(3, 'months')
    const senesteTom = (perioder: Periode[]) => {
        const nyeste = perioder
            .sort((p1, p2) =>
                dayjs(p1.tom).unix() - dayjs(p2.tom).unix()
            )[ 0 ]
        return dayjs(nyeste.tom)
    }
    return sykmeldinger.filter((syk) =>
        senesteTom(syk.sykmeldingsperioder) > treMndSiden
    )
}


const Arbeidssituasjon = () => {
    const { data: narmesteLedere } = useNarmesteledere()
    const { data: sykmeldinger } = useSykmeldinger()

    // eslint-disable-next-line no-console
    console.log(narmesteLedere)
    if (!sykmeldinger || !narmesteLedere) {
        return null
    }

    // eslint-disable-next-line no-console
    console.log('Forbi return null')
    const finnAktuelleArbeidsgivere = () => {
        const aktiveLedereOrgnummer = narmesteLedere
            .filter((nl) => !nl.aktivTom && nl.navn)
            .map((nl) => nl.orgnummer)
        const sykmeldingerMedAktivNaermesteLeder = sykmeldinger
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'SENDT')
            .filter((syk) => aktiveLedereOrgnummer.includes(syk.sykmeldingStatus.arbeidsgiver?.orgnummer || ''))

        const sykmeldingerFiltrertPaPeriode = selectSykmeldingerYngreEnnTreMaaneder(sykmeldinger)
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'SENDT')

        const sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel: Sykmelding[] = [
            ...sykmeldingerMedAktivNaermesteLeder,
            ...sykmeldingerFiltrertPaPeriode,
        ]
        const unikeArbeidsgiver = new Set(
            sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel
                .filter((syk) => syk.sykmeldingStatus.arbeidsgiver)
                .map((syk) => syk.sykmeldingStatus.arbeidsgiver!.orgnummer)
        )

        return Array.from(unikeArbeidsgiver)
    }

    const finnAktuelleArbeidssituasjoner = (): string[] => {
        const arbeidsgivere: string[] = finnAktuelleArbeidsgivere()
        const arbeidssituasjoner = selectSykmeldingerYngreEnnTreMaaneder(sykmeldinger)
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'BEKREFTET')
            .map((syk) => hentArbeidssituasjon(syk)!)
            .filter((arbeidssituasjon) => !(arbeidssituasjon === 'ARBEIDSTAKER' && arbeidsgivere.length))

        return arbeidssituasjoner
    }

    const arbeidsgivere: string[] = finnAktuelleArbeidsgivere()
    const arbeidssituasjoner: string[] = finnAktuelleArbeidssituasjoner()

    const arbeidssituasjonTilIkon = (arbeidssituasjon: RSArbeidssituasjonType) => {
        switch (arbeidssituasjon) {
            case 'ARBEIDSTAKER':
                return ArbeidsgiverIkon
            case 'NAERINGSDRIVENDE':
            case 'FRILANSER':
                return SelvstendigFrilanserIkon
            default:
                return AnnenArbeidssituasjonIkon
        }
    }

    return (
        <Vis
            hvis={(arbeidsgivere && arbeidsgivere.length > 0) || (arbeidssituasjoner && arbeidssituasjoner.length > 0)}>
            <div className="landingspanel din-situasjon">
                <header className="din-situasjon__header">
                    <img src={ArbeidssituasjonIkon} alt="Arbeidssituasjon" />
                    <h2>{tekst('din-situasjon.tittel.2')}</h2>
                    <Hjelpetekst>{tekst('din-situasjon.hjelpetekst.tekst')}</Hjelpetekst>
                </header>
                <div className="arbeidssituasjon-panel">
                    {
                        arbeidsgivere.map((orgnummer, idx) => {
                            return (
                                <div className="situasjon__panel" key={idx}>
                                    <div className={'situasjon'}>
                                        <div className="situasjon__ikon">
                                            <img src={arbeidssituasjonTilIkon('ARBEIDSTAKER')}
                                                alt={tekst('din-situasjon.ARBEIDSTAKER')} />
                                        </div>
                                        <Arbeidsgiver orgnummer={orgnummer} />
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        arbeidssituasjoner.map((arbeidssituasjon, idx) => {
                            const arbeidssituasjonLedetekst = tekst(`din-situasjon.${arbeidssituasjon}` as any)
                            return (
                                <div className="situasjon__panel" key={idx}>
                                    <div className={'situasjon'}>
                                        <div className="situasjon__ikon">
                                            <img src={arbeidssituasjonTilIkon(arbeidssituasjon as any)}
                                                alt={arbeidssituasjonLedetekst} />
                                        </div>
                                        <div className="situasjon__innhold">
                                            <Normaltekst>{arbeidssituasjonLedetekst}</Normaltekst>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Vis>
    )
}

export default Arbeidssituasjon
