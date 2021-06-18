import dayjs from 'dayjs'

import { hentLoginUrl } from '../data/data-fetcher'
import { Periode, Sykmelding } from '../types/sykmelding'
import { logger } from './logger'


export const redirectTilLoginHvis401 = (res: Response) => {
    if (res.status === 401) {
        logger.warn('Redirecter til login grunnet 401')
        window.location.href = hentLoginUrl()
        return true
    }
    return false
}


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
