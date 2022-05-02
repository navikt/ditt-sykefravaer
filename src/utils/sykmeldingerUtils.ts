import dayjs from 'dayjs'

import { Periode, Sykmelding } from '../types/sykmelding'

export const hentArbeidssituasjon = (sykmelding: Sykmelding) => {
    return sykmelding.sykmeldingStatus.sporsmalOgSvarListe?.find(
        (s) => s.shortName === 'ARBEIDSSITUASJON'
    )?.svar?.svar
}

export const tidligsteFom = (perioder: Periode[]) => {
    const tidligste = perioder
        .map((p) => dayjs(p.fom))
        .sort((p1, p2) => {
            if (p1 > p2) {
                return 1
            }
            if (p1 < p2) {
                return -1
            }
            return 0
        })[0]
    return dayjs(tidligste)
}

export const senesteTom = (perioder: Periode[]) => {
    const seneste = perioder
        .map((p) => dayjs(p.tom))
        .sort((p1, p2) => {
            if (p1 < p2) {
                return 1
            }
            if (p1 > p2) {
                return -1
            }
            return 0
        })[0]
    return dayjs(seneste)
}

export const selectSykmeldingerYngreEnnTreMaaneder = (
    sykmeldinger: Sykmelding[]
) => {
    const treMndSiden = dayjs().subtract(3, 'months')

    return sykmeldinger.filter(
        (syk) => senesteTom(syk.sykmeldingsperioder) > treMndSiden
    )
}
