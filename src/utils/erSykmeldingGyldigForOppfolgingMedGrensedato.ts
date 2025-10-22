import { DittSykefravaerSykmelding } from '../types/dittSykefravaerSykmelding'

const MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING = 4

export const erSykmeldingGyldigForOppfolgingMedGrensedato = (
    sykmelding: DittSykefravaerSykmelding,
    dato: Date,
): boolean => {
    return (
        sykmelding.sykmeldingsperioder.filter((periode) => {
            const tomGrenseDato = new Date(dato)
            tomGrenseDato.setHours(0, 0, 0, 0)
            tomGrenseDato.setMonth(tomGrenseDato.getMonth() - MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING)
            return new Date(periode.tom) >= new Date(tomGrenseDato)
        }).length > 0
    )
}
