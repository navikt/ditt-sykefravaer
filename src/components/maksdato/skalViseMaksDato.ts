import dayjs from 'dayjs'

import { Sykmelding } from '../../types/sykmelding'
import { MaxDate } from '../../hooks/useMaxDate'

export const erSykmeldingInnafor = (sykmelding: Sykmelding, dagerTilbake: number): boolean => {
    return sykmelding.sykmeldingsperioder.some((periode) =>
        dayjs(periode.tom).isAfter(dayjs().subtract(dagerTilbake, 'days')),
    )
}

export const skalViseMaksDato = (sykmeldinger: Sykmelding[] | undefined, maxdate: MaxDate | undefined): boolean => {
    if (!sykmeldinger || !maxdate || !maxdate.utbetaltTom || !maxdate.maxDate) {
        return false
    }

    const erSykmeldt = sykmeldinger.some((sykmelding) => erSykmeldingInnafor(sykmelding, 17))

    return erSykmeldt && !dayjs(maxdate.utbetaltTom).isBefore(dayjs().subtract(60, 'days'))
}
