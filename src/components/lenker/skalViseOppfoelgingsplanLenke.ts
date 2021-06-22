import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { Sykmelding } from '../../types/sykmelding'

const MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING = 4
// Kode fra gammelt ditt sykefravær

const erSykmeldingGyldigForOppfolgingMedGrensedato = (sykmelding: Sykmelding, dato: Date) => {
    return sykmelding.sykmeldingsperioder.filter((periode) => {
        const tomGrenseDato = new Date(dato)
        tomGrenseDato.setHours(0, 0, 0, 0)
        tomGrenseDato.setMonth(tomGrenseDato.getMonth() - MND_SIDEN_SYKMELDING_GRENSE_FOR_OPPFOELGING)
        return new Date(periode.tom) >= new Date(tomGrenseDato)
    }).length > 0
}

const sykmeldtHarGyldigSykmelding = (sykmeldinger: Sykmelding[] | undefined) => {
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


export const skalViseOppfoelgingsplanLenke = (sykmeldinger: Sykmelding[] | undefined, oppfolgingsplaner: Oppfolgingsplan[] | undefined) => {
    return sykmeldtHarGyldigSykmelding(sykmeldinger) || (oppfolgingsplaner && oppfolgingsplaner.length > 0)
}
