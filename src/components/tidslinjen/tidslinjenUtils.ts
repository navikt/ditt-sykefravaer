import dayjs from 'dayjs'

import { Hendelse, HendelseType, SimpleHendelse } from '../../types/hendelse'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'

export const tidslinjeIkon = (type: HendelseType) => {
    switch (type) {
        case 'FØRSTE_SYKMELDINGSDAG':
            return '/syk/sykefravaer/static/tidslinjen/plaster.svg'
        case 'AKTIVITETSKRAV_VARSEL':
            return '/syk/sykefravaer/static/tidslinjen/varsel.svg'
        case 'TITTEL':
        case 'TID':
            return '/syk/sykefravaer/static/tidslinjen/klokke.svg'
        default:
            return '/syk/sykefravaer/static/tidslinjen/sirkel.svg'
    }
}

export const hendelseIkon = (hendelse: Hendelse) => {
    switch (hendelse.tekstkey) {
        case 'tidslinje.sykmeldt-hva-naa.MED_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa.UTEN_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa__modia.MED_ARBEIDSGIVER':
        case 'tidslinje.sykmeldt-hva-naa__modia.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/sykmeldt-hva-naa.svg'
        case 'tidslinje.snakk-med-arbeidsgiver.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/innen4uker.svg'
        case 'tidslinje.dialogmote-arbeidsgiver.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/innen7uker.svg'
        case 'tidslinje.aktivitetskrav.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/innen8uker.svg'
        case 'tidslinje.dialogmote-nav.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/innen26uker.svg'
        case 'tidslinje.langtidssykmeldt.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/innen39uker.svg'
        case 'tidslinje.mulighet-for-aktivitet.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/uten-arbeidsgiver/innen8uker-4.svg'
        case 'tidslinje.snakk-med-nav.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/uten-arbeidsgiver/innen12uker.svg'
        case 'tidslinje.aktivitetsplan.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/uten-arbeidsgiver/innen39uker.svg'
        case 'tidslinje.aktivitetskrav-varsel.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/uten-arbeidsgiver/varsel_aktivitetskrav.svg'
        case 'tidslinje.aktivitetskrav-varsel.MED_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/hendelse/med-arbeidsgiver/varsel_aktivitetskrav.svg'
        case 'tidslinje.sluttfasen.MED_ARBEIDSGIVER':
        case 'tidslinje.sluttfasen.UTEN_ARBEIDSGIVER':
            return '/syk/sykefravaer/static/tidslinjen/sluttfasen-3.svg'
    }
}

const hentAntallDager = (hendelse: Hendelse, startdato?: dayjs.Dayjs) => {
    const oppfolgingsdato = dayjs(startdato)
    const inntruffetdato = dayjs(hendelse.inntruffetdato)
    return inntruffetdato.diff(oppfolgingsdato, 'days')
}

const sorterHendelser = (hendelser: Hendelse[], startdato?: dayjs.Dayjs) => {
    return hendelser.sort((a, b) => {
        return (
            (a.antallDager || hentAntallDager(a, startdato)) -
            (b.antallDager || hentAntallDager(b, startdato))
        )
    })
}

// TODO: Kanskje mer oversiktelig å hardkode disse inn i koden
const leggTypePaaTekstnokkel = (
    hendelser: Hendelse[],
    type: Visning
): Hendelse[] => {
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
    startdato?: dayjs.Dayjs
): Hendelse[] => {
    const startsdatoHendelse = (): Hendelse[] => {
        if (startdato) {
            return [
                {
                    type: 'FØRSTE_SYKMELDINGSDAG',
                    tekstkey: 'tidslinje.forste-sykmeldingsdag',
                    inntruffetdato: startdato.format('YYYY-MM-DD'),
                    antallDager: 0,
                },
            ]
        } else {
            return [
                {
                    type: 'TITTEL',
                    tekstkey: 'tidslinje.sykefravaeret-starter',
                    antallDager: 0,
                },
            ]
        }
    }

    const statiskeUkeTittelHendelser = (visning: Visning): Hendelse[] => {
        const uker =
            visning === 'UTEN_ARBEIDSGIVER' ? [8, 12, 39] : [4, 7, 17, 26, 39]

        return uker.map((uke) => {
            return {
                antallDager: uke * 7,
                type: 'TID',
                tekstkey: `tidslinje.antall-uker.${uke}`,
            }
        })
    }

    const statiskeUkeHendelser = (visning: Visning): Hendelse[] => {
        const aktivitetsplan = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 39 - 1,
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
                antallDager: 7 * 7 - 1,
                tekstkey: 'tidslinje.dialogmote-arbeidsgiver',
            }
        }

        const forberedelseDialogmoteNav = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 26 - 1,
                tekstkey: 'tidslinje.dialogmote-nav',
            }
        }

        const langtidssykmeldt = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 39 - 1,
                tekstkey: 'tidslinje.langtidssykmeldt',
            }
        }

        const navVurdereKravOmAktivitet = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 8 - 1,
                tekstkey: 'tidslinje.aktivitetskrav',
            }
        }

        const snakkMedArbeidsgiver = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 4 - 1,
                tekstkey: 'tidslinje.snakk-med-arbeidsgiver',
            }
        }

        const snakkMedNav = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 12 - 1,
                tekstkey: 'tidslinje.snakk-med-nav',
            }
        }

        const sluttfasenAvSykefravaeret = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 52 - 1,
                tekstkey: 'tidslinje.sluttfasen',
            }
        }

        const mulighetForAktivitetUtenArbeidsgiver = (): Hendelse => {
            return {
                type: 'BOBLE',
                antallDager: 7 * 8 - 1,
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
            return leggTypePaaTekstnokkel(
                hentHendelserMedArbeidsgiver(),
                visning
            )
        } else {
            return leggTypePaaTekstnokkel(
                hentHendelserUtenArbeidsgiver(),
                visning
            )
        }
    }

    const narmesteLedereHendelser = (
        visning: Visning,
        narmesteLedere?: NarmesteLeder[],
        startdato?: dayjs.Dayjs
    ): Hendelse[] => {
        if (!narmesteLedere || !startdato) return []

        const nlHendelser: Hendelse[] = narmesteLedere
            .filter((nl) => nl.navn && dayjs(nl.aktivFom) >= startdato)
            .map((nl) => {
                return {
                    type: 'NY_NAERMESTE_LEDER',
                    tekstkey: 'tidslinje.ny-naermeste-leder',
                    inntruffetdato: nl.aktivFom,
                    data: {
                        naermesteLeder: nl,
                    },
                }
            })

        return leggTypePaaTekstnokkel(nlHendelser, visning)
    }

    return sorterHendelser(
        [
            ...startsdatoHendelse(),
            ...statiskeUkeTittelHendelser(visning),
            ...statiskeUkeHendelser(visning),
            ...narmesteLedereHendelser(visning, narmesteLedere, startdato),
        ],
        startdato
    )
}
