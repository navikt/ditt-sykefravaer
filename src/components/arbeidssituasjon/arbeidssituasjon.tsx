import './arbeidssituasjon.less'

import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { RSArbeidssituasjonType } from '../../types/rs-types/rs-arbeidssituasjon'
import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { hentArbeidssituasjon, selectSykmeldingerYngreEnnTreMaaneder } from '../../utils/utils'
import Vis from '../vis'
import ArbeidsgiverIkon from './arbeidsgiver.svg'
import ArbeidssituasjonIkon from './arbeidssituasjon.svg'
import SelvstendigFrilanserIkon from './id-kort.svg'
import AnnenArbeidssituasjonIkon from './skilt.svg'


// TODO: Flytt
interface ArbeidsgiverProps { orgnummer: string }
export const Arbeidsgiver = ({ orgnummer }: ArbeidsgiverProps) => {
    const { narmesteLedere, sykmeldinger  } = useAppStore()

    let arbeidsgiverNavn = narmesteLedere.find((nl) => nl.orgnummer === orgnummer)?.organisasjonsnavn

    if (!arbeidsgiverNavn) {
        arbeidsgiverNavn = selectSykmeldingerYngreEnnTreMaaneder(sykmeldinger)
            .find((syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer &&
                syk.sykmeldingStatus.arbeidsgiver?.orgNavn
            )
            ?.sykmeldingStatus.arbeidsgiver!.orgNavn
    }

    return (
        <div className="situasjon__innhold">
            <Normaltekst>{tekst('din-situasjon.ansatt') + arbeidsgiverNavn}</Normaltekst>
            <NaermesteLederContainer orgnummer={orgnummer} />
        </div>
    )
}

// TODO: Flytt
interface NaermesteLederContainerProps { orgnummer: string }
export const NaermesteLederContainer = ({ orgnummer }: NaermesteLederContainerProps) => {
    const { narmesteLedere } = useAppStore()

    const leder = narmesteLedere
        .filter((nl) => !nl.aktivTom && nl.navn)    // Aktiv og har navn på leder
        .find((nl) => nl.orgnummer === orgnummer)
    const [ open, setOpen ] = useState<boolean>(false)

    const toggleOpen = () => {
        setOpen(!open)
    }

    // TODO: Finnes også en egen tekst når lønn ikke forskuteres, men tror den aldri vises
    return (
        <Vis hvis={leder}>
            <Lightbox open={open} toggle={toggleOpen} narmesteLeder={leder!} />
            <Normaltekst className="leder__informasjon">
                Din nærmeste leder er <strong>{leder?.navn}</strong>.
            </Normaltekst>
            <Vis hvis={
                true // TODO: Finn ut hvor vi mottar avkreftet i fra
            }>
                <a className="lenke leder__meldFeil js-feil" onClick={() => toggleOpen()}>
                    <Normaltekst>Meld fra om endring</Normaltekst>
                </a>
            </Vis>
            <Vis hvis={leder?.arbeidsgiverForskuttererLoenn}>
                <div className="leder__forskuttering">
                    <Normaltekst> Arbeidsgiveren din betaler lønn også etter de 16 første dagene. </Normaltekst>
                    <Hjelpetekst> Arbeidsgiveren betaler vanligvis lønnen de første 16 kalenderdagene man er syk. Noen arbeidsgivere fortsetter å utbetale lønn og søker om å få pengene igjen fra NAV senere. Hvis du har en arbeidsgiver som stanser lønnen etter 16 dager, får du i stedet utbetalingen fra NAV. Det er arbeidsgiveren som melder inn til oss hva som gjelder hos dere. </Hjelpetekst>
                </div>
            </Vis>
        </Vis>
    )
}

// TODO: Flytt, padding inne i modal
interface LightboxProps { open: boolean, toggle: () => void, narmesteLeder: NarmesteLeder }
export const Lightbox = ({ open, toggle, narmesteLeder }: LightboxProps) => {
    useEffect(() => {
        Modal.setAppElement('#maincontent')
    }, [])

    // TODO: Må holde state på om nl er avkreftet for å vise egen tekst, avkreftete ledere blir ikke med i oversikten neste gang man går inn
    const avkreftet = false

    return (
        <Modal
            isOpen={open}
            closeButton={true}
            contentLabel="Modal"
            onRequestClose={toggle}
        >
            <Vis hvis={avkreftet}>
                <Undertittel tag="h2">Takk for oppdateringen!</Undertittel>
            </Vis>
            <Vis hvis={!avkreftet}>
                <BekreftFeilLeder narmesteLeder={narmesteLeder} avbryt={toggle} />
            </Vis>
        </Modal>
    )
}

// TODO: Flytt, oppsett av feilmelding
interface BekreftFeilLederProps { narmesteLeder: NarmesteLeder, avbryt: () => void }
export const BekreftFeilLeder = ({ narmesteLeder, avbryt }: BekreftFeilLederProps) => {
    const [ avkrefter, setAvkrefter ] = useState<boolean>(false)

    const avkreftLeder = (orgnummer: string) => {
        /***
         * prod = https://narmesteleder.nav.no
         * dc = http://localhost:6998/api/v1/syforest
         * NY lokal og dev i samme = https://narmesteleder.dev.nav.no
         */

        const backend = 'https://narmesteleder.nav.no'
        const url = `${backend}/${orgnummer}/avkreft`
        console.log('AVKREFTER!') // eslint-disable-line
    }

    return (
        <div>
            <Undertittel tag="h2">Endre nærmeste leder</Undertittel>
            <Normaltekst>Er du sikker på at du vil fjerne <strong>{narmesteLeder.navn}</strong> som din nærmeste leder i <strong>{narmesteLeder.organisasjonsnavn}</strong>?</Normaltekst>
            <Normaltekst>Hvis du er usikker på om navnet er riktig, bør du spørre arbeidsgiveren din om hvorfor de har valgt det.</Normaltekst>

            <div className="knapperad">
                <Knapp
                    htmlType="button"
                    spinner={avkrefter}
                    onClick={() => {
                        // TODO: Sett opp logikk for avkrefting av leder
                        setAvkrefter(true)
                        avkreftLeder(narmesteLeder.orgnummer)
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
    const { sykmeldinger, narmesteLedere } = useAppStore()

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
        <Vis hvis={(arbeidsgivere && arbeidsgivere.length > 0) || (arbeidssituasjoner && arbeidssituasjoner.length > 0)}>
            <div className="landingspanel din-situasjon lenkepanel lenkepanel--border">
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
                                            <img src={arbeidssituasjonTilIkon('ARBEIDSTAKER')} alt={tekst('din-situasjon.ARBEIDSTAKER')} />
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
                                            <img src={arbeidssituasjonTilIkon(arbeidssituasjon as any)} alt={arbeidssituasjonLedetekst} />
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
