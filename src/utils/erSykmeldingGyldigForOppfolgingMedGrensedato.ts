import { DittSykefravaerSykmelding } from '../types/dittSykefravaerSykmelding'

import { dateSub, toDate } from './dateUtils'

const MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING = 4

export const erSykmeldingGyldigForOppfolgingMedGrensedato = (
    sykmelding: DittSykefravaerSykmelding,
    dato: Date,
): boolean => {
    const tomGrenseDato = dateSub(dato, { months: MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING })
    const grenseDato = toDate(tomGrenseDato)

    return (
        sykmelding.sykmeldingsperioder.filter((periode) => {
            const periodeTom = toDate(periode.tom)
            return periodeTom >= grenseDato
        }).length > 0
    )
}
