import dayjs from 'dayjs'

import { Periode, Sykmelding } from '../types/sykmelding'


export const setBodyClass = (name: string) => {
    if (document.body.className !== '') {
        document.body.classList.remove(document.body.className)
    }
    document.body.classList.add(name)
}

export const hentArbeidssituasjon = (sykmelding: Sykmelding) => {
    return sykmelding.sykmeldingStatus.sporsmalOgSvarListe?.find(s => s.shortName === 'ARBEIDSSITUASJON')?.svar?.svar
}

export const selectSykmeldingerYngreEnnTreMaaneder = (sykmeldinger: Sykmelding[]) => {
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
