import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { Sykmelding } from '../../types/sykmelding'

const MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING = 4

const erSykmeldingGyldigForOppfolgingMedGrensedato = (sykmelding: Sykmelding, dato: Date): boolean => {
    return sykmelding.sykmeldingsperioder.filter((periode) => {
        const tomGrenseDato = new Date(dato)
        tomGrenseDato.setHours(0, 0, 0, 0)
        tomGrenseDato.setMonth(tomGrenseDato.getMonth() - MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING)
        return new Date(periode.tom) >= new Date(tomGrenseDato)
    }).length > 0
}

const sykmeldtHarGyldigSykmelding = (sykmeldinger: Sykmelding[] | undefined): boolean => {
    const tomGrenseDato = new Date()
    if (!sykmeldinger) {
        return false
    }
    return sykmeldinger.filter((sykmelding) => {
        return sykmelding.sykmeldingStatus.arbeidsgiver?.orgnummer !== null
    }).filter((sykmelding) => {
        return erSykmeldingGyldigForOppfolgingMedGrensedato(sykmelding, tomGrenseDato)
    }).length > 0
}

const sykmeldtHarOppfolgingsplan = (oppfolgingsplaner: Oppfolgingsplan[] | undefined): boolean => {
    if (!oppfolgingsplaner) {
        return false
    }
    return oppfolgingsplaner.length > 0
}


export const skalViseOppfoelgingsplanLenke = (sykmeldinger: Sykmelding[] | undefined, oppfolgingsplaner: Oppfolgingsplan[] | undefined): boolean => {
    return sykmeldtHarGyldigSykmelding(sykmeldinger) || sykmeldtHarOppfolgingsplan(oppfolgingsplaner)
}
