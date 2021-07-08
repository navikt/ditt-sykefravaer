import dayjs from 'dayjs'

import Innen4UkerMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/innen4uker.svg'
import Innen7UkerMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/innen7uker.svg'
import Innen8UkerMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/innen8uker.svg'
import Innen26UkerMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/innen26uker.svg'
import Innen39UkerMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/innen39uker.svg'
import AktivitetskravMedArbeidsgiver from '../../grafikk/tidslinjen/hendelse/med-arbeidsgiver/varsel_aktivitetskrav.svg'
import Innen8UkerUtenArbeidsgiver from '../../grafikk/tidslinjen/hendelse/uten-arbeidsgiver/innen8uker-4.svg'
import Innen12UkerUtenArbeidsgiver from '../../grafikk/tidslinjen/hendelse/uten-arbeidsgiver/innen12uker.svg'
import Innen39UkerUtenArbeidsgiver from '../../grafikk/tidslinjen/hendelse/uten-arbeidsgiver/innen39uker.svg'
import AktivitetskravUtenArbeidsgiver from '../../grafikk/tidslinjen/hendelse/uten-arbeidsgiver/varsel_aktivitetskrav.svg'
import KlokkeIkon from '../../grafikk/tidslinjen/klokke.svg'
import PlasterIkon from '../../grafikk/tidslinjen/plaster.svg'
import SirkelIkon from '../../grafikk/tidslinjen/sirkel.svg'
import Sluttfasen from '../../grafikk/tidslinjen/sluttfasen-3.svg'
import HvaNa from '../../grafikk/tidslinjen/sykmeldt-hva-naa.svg'
import VarselIkon from '../../grafikk/tidslinjen/varsel.svg'
import { Hendelse, HendelseType, SimpleHendelse } from '../../types/hendelse'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'

export const tidslinjeIkon = (type: HendelseType) => {
    switch (type) {
        case 'FØRSTE_SYKMELDINGSDAG':
            return PlasterIkon
        case 'AKTIVITETSKRAV_VARSEL':
            return VarselIkon
        case 'TITTEL':
        case 'TID':
            return KlokkeIkon
        default:
            return SirkelIkon
    }
}

export const hendelseIkon = (hendelse: Hendelse) => {
    switch (hendelse.tekstkey) {
        case 'tidslinje.sykmeldt-hva-naa.MED_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa.UTEN_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa__modia.MED_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa__modia.UTEN_ARBEIDSGIVER':
            return HvaNa
        case 'tidslinje.snakk-med-arbeidsgiver.MED_ARBEIDSGIVER':
            return Innen4UkerMedArbeidsgiver
        case 'tidslinje.dialogmote-arbeidsgiver.MED_ARBEIDSGIVER':
            return Innen7UkerMedArbeidsgiver
        case 'tidslinje.aktivitetskrav.MED_ARBEIDSGIVER':
            return Innen8UkerMedArbeidsgiver
        case 'tidslinje.dialogmote-nav.MED_ARBEIDSGIVER':
            return Innen26UkerMedArbeidsgiver
        case 'tidslinje.langtidssykmeldt.MED_ARBEIDSGIVER':
            return Innen39UkerMedArbeidsgiver
        case 'tidslinje.mulighet-for-aktivitet.UTEN_ARBEIDSGIVER':
            return Innen8UkerUtenArbeidsgiver
        case 'tidslinje.snakk-med-nav.UTEN_ARBEIDSGIVER':
            return Innen12UkerUtenArbeidsgiver
        case 'tidslinje.aktivitetsplan.UTEN_ARBEIDSGIVER':
            return Innen39UkerUtenArbeidsgiver
        case 'tidslinje.aktivitetskrav-varsel.UTEN_ARBEIDSGIVER':
            return AktivitetskravUtenArbeidsgiver
        case 'tidslinje.aktivitetskrav-varsel.MED_ARBEIDSGIVER':
            return AktivitetskravMedArbeidsgiver
        case 'tidslinje.sluttfasen.MED_ARBEIDSGIVER':
        case 'tidslinje.sluttfasen.UTEN_ARBEIDSGIVER':
            return Sluttfasen
    }
}

const hentAntallDager = (hendelse: Hendelse, startdato?: dayjs.Dayjs) => {
    const oppfolgingsdato = dayjs(startdato)
    const inntruffetdato = dayjs(hendelse.inntruffetdato)
    return inntruffetdato.diff(oppfolgingsdato, 'days')
}

const sorterHendelser = (hendelser: Hendelse[], startdato?: dayjs.Dayjs) => {
    return hendelser.sort((a, b) => {
        return (a.antallDager || hentAntallDager(a, startdato)) - (b.antallDager || hentAntallDager(b, startdato))
    })
}

// TODO: Kanskje mer oversiktelig å hardkode disse inn i koden
const leggTypePaaTekstnokkel = (hendelser: Hendelse[], type: Visning): Hendelse[] => {
    return hendelser.map((hendelse) => {
        return Object.assign({}, hendelse, {
            tekstkey: `${hendelse.tekstkey}.${type}`,
        })
    })
}

export const leggTilTidshendelser = (
    visning: Visning,
    henteteHendelser?: SimpleHendelse[],
    narmesteLedere?: NarmesteLeder[],
    startdato?: dayjs.Dayjs,
): Hendelse[] => {

    const startsdatoHendelse = (): Hendelse[] => {
        if (startdato) {
            return [ {
                type: 'FØRSTE_SYKMELDINGSDAG',
                tekstkey: 'tidslinje.forste-sykmeldingsdag',
                inntruffetdato: startdato.format('YYYY-MM-DD'),
                antallDager: 0
            } ]
        } else {
            return [ {
                type: 'TITTEL',
                tekstkey: 'tidslinje.sykefravaeret-starter',
                antallDager: 0
            } ]
        }
    }

    const statiskeUkeTittelHendelser = (visning: Visning): Hendelse[] => {
        const uker = (visning === 'UTEN_ARBEIDSGIVER')
            ? [ 8, 12, 39 ]
            : [ 4, 7, 17, 26, 39 ]

        return uker.map((uke) => {
            return {
                antallDager: (uke * 7),
                type: 'TID',
                tekstkey: `tidslinje.antall-uker.${uke}`,
            }
        })
    }

    const statiskeUkeHendelser = (visning: Visning): Hendelse[] => {

        const aktivitetsplan = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 39) - 1,
                tekstkey: 'tidslinje.aktivitetsplan',
            }
        }

        const sykmeldtHvaNaa = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 1,
                tekstkey: 'tidslinje.sykmeldt-hva-naa',
            }
        }

        const forberedelseDialogmoteArbeidsgiver = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 7) - 1,
                tekstkey: 'tidslinje.dialogmote-arbeidsgiver',
            }
        }

        const forberedelseDialogmoteNav = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 26) - 1,
                tekstkey: 'tidslinje.dialogmote-nav',
            }
        }

        const langtidssykmeldt = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 39) - 1,
                tekstkey: 'tidslinje.langtidssykmeldt',
            }
        }

        const navVurdereKravOmAktivitet = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 8) - 1,
                tekstkey: 'tidslinje.aktivitetskrav',
            }
        }

        const snakkMedArbeidsgiver = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 4) - 1,
                tekstkey: 'tidslinje.snakk-med-arbeidsgiver',
            }
        }

        const snakkMedNav = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 12) - 1,
                tekstkey: 'tidslinje.snakk-med-nav',
            }
        }

        const sluttfasenAvSykefravaeret = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 52) - 1,
                tekstkey: 'tidslinje.sluttfasen',
            }
        }

        const mulighetForAktivitetUtenArbeidsgiver = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: (7 * 8) - 1,
                tekstkey: 'tidslinje.mulighet-for-aktivitet',
            }
        }


        const hentHendelserMedArbeidsgiver = (): Hendelse[] => {
            return [
                sykmeldtHvaNaa(),
                snakkMedArbeidsgiver(),
                forberedelseDialogmoteArbeidsgiver(),
                navVurdereKravOmAktivitet(),
                forberedelseDialogmoteNav(),
                langtidssykmeldt(),
                sluttfasenAvSykefravaeret(),
            ]
        }

        const hentHendelserUtenArbeidsgiver = (): Hendelse[] => {
            return [
                sykmeldtHvaNaa(),
                mulighetForAktivitetUtenArbeidsgiver(),
                snakkMedNav(),
                aktivitetsplan(),
                sluttfasenAvSykefravaeret(),
            ]
        }

        if (visning === 'MED_ARBEIDSGIVER') {
            return leggTypePaaTekstnokkel(hentHendelserMedArbeidsgiver(), visning)
        } else {
            return leggTypePaaTekstnokkel(hentHendelserUtenArbeidsgiver(), visning)
        }
    }

    // TODO: Vurder om denne skal hentes i fra hendelser
    // Denne kommer egentlig i fra hendelser, men kan nå hentes i fra nl dataen
    const narmesteLedereHendelser = (visning: Visning, narmesteLedere?: NarmesteLeder[], startdato?: dayjs.Dayjs): Hendelse[] => {
        if (!narmesteLedere || !startdato) return []

        const nlHendelser: Hendelse[] = narmesteLedere
            .filter((nl) => nl.navn && dayjs(nl.aktivFom) >= startdato)
            .map((nl) => {
                return {
                    type: 'NY_NAERMESTE_LEDER',
                    tekstkey: 'tidslinje.ny-naermeste-leder',
                    inntruffetdato: nl.aktivFom,
                    data: {
                        naermesteLeder: nl
                    }
                }
            })

        return leggTypePaaTekstnokkel(nlHendelser, visning)
    }

    // TODO: Finnes det andre hendelser?
    // Alt annet vises som HendelseTittel
    // AKTIVITETSKRAV_BEKREFTET
    const andreHendelser = (): Hendelse[] => {
        if (!henteteHendelser) return []

        return henteteHendelser.map((sh) => {
            return {
                inntruffetdato: sh.inntruffetdato,
                type: sh.type,
                antallDager: undefined,
                tekstkey: 'Hent denne',
                data: undefined
            }
        })
    }

    return sorterHendelser([
        ...startsdatoHendelse(),
        ...statiskeUkeTittelHendelser(visning),
        ...statiskeUkeHendelser(visning),
        ...narmesteLedereHendelser(visning, narmesteLedere, startdato),
        ...andreHendelser(),
    ], startdato)
}
