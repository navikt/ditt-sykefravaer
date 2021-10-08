import dayjs from 'dayjs'

import { SimpleSykmelding, Sykeforloep } from '../../types/sykeforloep'
import { Sykmelding } from '../../types/sykmelding'
import { hentArbeidssituasjon, senesteTom } from '../../utils/sykmeldingerUtils'
import { Visning } from './TidslinjeUtdrag'

// Henter startdato for nyeste sykeforløp
export const hentStartdatoFraSykeforloep = (sykeforloep?: Sykeforloep[]) => {
    if (!sykeforloep || sykeforloep.length === 0) {
        return undefined
    }

    const startdato = sykeforloep.sort((s1, s2) =>
        dayjs(s2.oppfolgingsdato).unix() - dayjs(s1.oppfolgingsdato).unix()
    )[0].oppfolgingsdato

    return dayjs(startdato)
}

// Sjekker at bruker er syk nå og ikke har noen nye sykmeldinger
export const arbeidsrettetOppfolgingSykmeldtInngangAktiv = (startdato: dayjs.Dayjs, sykeforloep?: Sykeforloep[], alleSykmeldinger?: Sykmelding[]) => {
    const iDag = dayjs()

    const finnAktuelleSykmeldinger = (sykmeldinger: SimpleSykmelding[]) => {
        return sykmeldinger.filter((s) =>
            iDag >= dayjs(s.fom) && iDag <= dayjs(s.tom).endOf('day')
        )
    }

    const aktueltSykeforloep = sykeforloep?.find((s) => dayjs(s.oppfolgingsdato).diff(startdato, 'days') === 0)
    if (!aktueltSykeforloep) return false

    const aktiveSykmeldinger = finnAktuelleSykmeldinger(aktueltSykeforloep.sykmeldinger)
    if (!aktiveSykmeldinger) return false


    const erArbeidsrettetOppfolgingSykmeldtInngangAktiv = aktiveSykmeldinger.length > 0 &&
        alleSykmeldinger?.find((s) => s.sykmeldingStatus.statusEvent === 'APEN') === undefined &&
        iDag.diff(startdato, 'weeks') >= 39

    return erArbeidsrettetOppfolgingSykmeldtInngangAktiv
}

// Lengde på sykeforløpet, Tvinger antall dager hvis det er ny sykmelding eller ingen sykmelding som er aktive
export const getSykefravaerVarighet = (sykeforloep?: Sykeforloep[], sykmeldinger?: Sykmelding[]) => {
    const TRETTINI_UKER = 7 * 39
    const TVING_MER_ENN_39_UKER = 275
    const TVING_MINDRE_ENN_39_UKER = 272

    const startdato = hentStartdatoFraSykeforloep(sykeforloep)
    if (!startdato) return 0
    const erArbeidsrettetOppfolgingSykmeldtInngangAktiv = arbeidsrettetOppfolgingSykmeldtInngangAktiv(startdato, sykeforloep, sykmeldinger)

    const dagensDato = dayjs()
    const antallDager = dagensDato.diff(startdato, 'days') + 1

    if (antallDager > 500) {
        return antallDager
    }
    if(erArbeidsrettetOppfolgingSykmeldtInngangAktiv) {
        return TVING_MER_ENN_39_UKER
    }
    if(antallDager > TRETTINI_UKER && erArbeidsrettetOppfolgingSykmeldtInngangAktiv === false) {
        return TVING_MINDRE_ENN_39_UKER
    }
    return antallDager
}

export const skalViseUtdrag = (sykmeldinger?: Sykmelding[]) => {
    const ETT_DOGN = 60 * 60 * 24
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

export const getVisning = (sykeforloep?: Sykeforloep[], sykmeldinger?: Sykmelding[]): Visning => {
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
