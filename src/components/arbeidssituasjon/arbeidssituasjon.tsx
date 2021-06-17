import './arbeidssituasjon.less'

import dayjs from 'dayjs'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { RSArbeidssituasjonType } from '../../types/rs-types/rs-arbeidssituasjon'
import { Periode, Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { hentArbeidssituasjon } from '../../utils/utils'
import Vis from '../vis'
import ArbeidsgiverIkon from './arbeidsgiver.svg'
import ArbeidssituasjonIkon from './arbeidssituasjon.svg'
import SelvstendigFrilanserIkon from './id-kort.svg'
import AnnenArbeidssituasjonIkon from './skilt.svg'


// TODO: Flytt
interface ArbeidsgiverProps { arbeidsgiver: string }
export const Arbeidsgiver = ({ arbeidsgiver }: ArbeidsgiverProps) => {
    return (
        <div className="situasjon__innhold">
            <Normaltekst>{tekst('din-situasjon.ansatt') + arbeidsgiver}</Normaltekst>
            <NaermesteLederContainer organisasjonsnavn={arbeidsgiver} />
        </div>
    )
}

// TODO: Flytt
interface NaermesteLederContainerProps { organisasjonsnavn: string }
export const NaermesteLederContainer = ({ organisasjonsnavn }: NaermesteLederContainerProps) => {
    // TODO: Match orgnavn med ledere som er hentet
    const leder = {
        navn: 'Ole Olsen',
        orgnummer: '123456789',
        organisasjonsnavn: organisasjonsnavn,
        avkreftet: false,    // TODO: Egen variabel eller kommer den med når vi henter data?
        arbeidsgiverForskuttererLoenn: true,   // TODO: Sjekk om det er date eller bool
    }
    const [ open, setOpen ] = useState<boolean>(false)

    const toggleOpen = () => {
        setOpen(!open)
    }

    // TODO: Finnes også en egen tekst når lønn ikke forskuteres, men tror den aldri vises
    return (
        <div>
            <Lightbox open={open} toggle={toggleOpen} leder={leder} />
            <Normaltekst className="leder__informasjon">
                Din nærmeste leder er <strong>{leder.navn}</strong>.
            </Normaltekst>
            <Vis hvis={!leder.avkreftet}>
                <a className="lenke leder__meldFeil js-feil" onClick={() => toggleOpen()}>
                    <Normaltekst>Meld fra om endring</Normaltekst>
                </a>
            </Vis>
            <Vis hvis={leder.arbeidsgiverForskuttererLoenn}>
                <div className="leder__forskuttering">
                    <Normaltekst> Arbeidsgiveren din betaler lønn også etter de 16 første dagene. </Normaltekst>
                    <Hjelpetekst> Arbeidsgiveren betaler vanligvis lønnen de første 16 kalenderdagene man er syk. Noen arbeidsgivere fortsetter å utbetale lønn og søker om å få pengene igjen fra NAV senere. Hvis du har en arbeidsgiver som stanser lønnen etter 16 dager, får du i stedet utbetalingen fra NAV. Det er arbeidsgiveren som melder inn til oss hva som gjelder hos dere. </Hjelpetekst>
                </div>
            </Vis>
        </div>
    )
}

// TODO: Flytt, padding inne i modal
interface LightboxProps { open: boolean, toggle: () => void, leder: any }
export const Lightbox = ({ open, toggle, leder }: LightboxProps) => {
    useEffect(() => {
        Modal.setAppElement('#maincontent')
    }, [])

    return (
        <Modal
            isOpen={open}
            closeButton={true}
            contentLabel="Modal"
            onRequestClose={toggle}
        >
            <Vis hvis={leder.avkreftet}>
                <Undertittel tag="h2">Takk for oppdateringen!</Undertittel>
            </Vis>
            <Vis hvis={!leder.avkreftet}>
                <BekreftFeilLeder leder={leder} avbryt={toggle} />
            </Vis>
        </Modal>
    )
}

// TODO: Flytt, oppsett av feilmelding
interface BekreftFeilLederProps { leder: any, avbryt: () => void }
export const BekreftFeilLeder = ({ leder, avbryt }: BekreftFeilLederProps) => {
    const [ avkrefter, setAvkrefter ] = useState<boolean>(false)

    return (
        <div>
            <Undertittel tag="h2">Endre nærmeste leder</Undertittel>
            <Normaltekst>Er du sikker på at du vil fjerne <strong>{leder.navn}</strong> som din nærmeste leder i <strong>{leder.organisasjonsnavn}</strong>?</Normaltekst>
            <Normaltekst>Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor de har valgt det.</Normaltekst>

            <div className="knapperad">
                <Knapp
                    htmlType="button"
                    spinner={avkrefter}
                    onClick={() => {
                        // TODO: Sett opp logikk for avkrefting av leder
                        setAvkrefter(true)
                        console.log('AVKREFTER!') // eslint-disable-line
                    }}
                >
                    Ja, jeg er sikker
                </Knapp>
                <a className="lenke js-avbryt" onClick={() => avbryt()}>
                    <Normaltekst>Avbryt</Normaltekst>
                </a>
            </div>
        </div>
    )
}

const Arbeidssituasjon = () => {
    const { sykmeldinger } = useAppStore()

    const selectSykmeldingerYngreEnnTreMaaneder = () => {
        const treMndSiden = dayjs().subtract(3, 'months')
        const senesteTom = (perioder: Periode[]) => {
            const nyeste = perioder
                .sort((p1, p2) =>
                    dayjs(p1.tom).unix() - dayjs(p2.tom).unix()
                )[0]
            return dayjs(nyeste.tom)
        }
        return sykmeldinger.filter((syk) =>
            senesteTom(syk.sykmeldingsperioder) > treMndSiden
        )
    }

    const finnAktuelleArbeidsgivere = () => {
        const aktiveLedereOrgnummer = [ '972674818' ]     // TODO: state.ledere, aktive nl
        const sykmeldingerMedAktivNaermesteLeder = sykmeldinger
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'SENDT')
            .filter((syk) => aktiveLedereOrgnummer.includes(syk.sykmeldingStatus.arbeidsgiver?.orgnummer || ''))

        const sykmeldingerFiltrertPaPeriode = selectSykmeldingerYngreEnnTreMaaneder()
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'SENDT')

        const sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel: Sykmelding[] = [
            ...sykmeldingerMedAktivNaermesteLeder,
            ...sykmeldingerFiltrertPaPeriode,
        ]
        const unikeArbeidsgiverNavn = new Set(
            sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel
                .filter((syk) => syk.sykmeldingStatus.arbeidsgiver)
                .map((syk) => syk.sykmeldingStatus.arbeidsgiver!.orgNavn)
        )

        return Array.from(unikeArbeidsgiverNavn)
    }

    const finnAktuelleArbeidssituasjoner = (): string[] => {
        const arbeidsgivere: string[] = finnAktuelleArbeidsgivere()
        const arbeidssituasjoner = selectSykmeldingerYngreEnnTreMaaneder()
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
        <Vis hvis={(arbeidsgivere && arbeidsgivere.length > 0) || (arbeidssituasjoner && arbeidssituasjoner.length > 0)}>
            <div className="landingspanel din-situasjon lenkepanel lenkepanel--border">
                <header className="din-situasjon__header">
                    <img src={ArbeidssituasjonIkon} alt="Arbeidssituasjon" />
                    <h2>{tekst('din-situasjon.tittel.2')}</h2>
                    <Hjelpetekst>{tekst('din-situasjon.hjelpetekst.tekst')}</Hjelpetekst>
                </header>
                <div className="arbeidssituasjon-panel">
                    {
                        arbeidsgivere.map((arbeidsgiver, idx) => {
                            return (
                                <div className="situasjon__panel" key={idx}>
                                    <div className={`situasjon ${idx > 0 ? 'situasjon__arbeidsgiver' : ''}`}>
                                        <div className="situasjon__ikon">
                                            <img src={arbeidssituasjonTilIkon('ARBEIDSTAKER')} alt={tekst('din-situasjon.ARBEIDSTAKER')} />
                                        </div>
                                        <Arbeidsgiver arbeidsgiver={arbeidsgiver} />
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
                                    <div className={`situasjon ${idx > 0 ? 'situasjon__arbeidssituasjon' : ''}`}>
                                        <div className="situasjon__ikon">
                                            <img src={arbeidssituasjonTilIkon(arbeidssituasjon as any)} alt={arbeidssituasjonLedetekst} />
                                        </div>
                                        <Normaltekst className="situasjon__tittel">{arbeidssituasjonLedetekst}</Normaltekst>
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
