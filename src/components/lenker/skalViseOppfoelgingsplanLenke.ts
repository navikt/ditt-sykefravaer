import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { Sykmelding } from '../../types/sykmelding'
import { erSykmeldingGyldigForOppfolgingMedGrensedato } from '../../utils/erSykmeldingGyldigForOppfolgingMedGrensedato'

const sykmeldtHarGyldigSykmelding = (sykmeldinger: Sykmelding[] | undefined): boolean => {
    const tomGrenseDato = new Date()
    if (!sykmeldinger) {
        return false
    }
    return (
        sykmeldinger
            .filter((sykmelding) => {
                return sykmelding.sykmeldingStatus.arbeidsgiver?.orgnummer !== null
            })
            .filter((sykmelding) => {
                return erSykmeldingGyldigForOppfolgingMedGrensedato(sykmelding, tomGrenseDato)
            }).length > 0
    )
}

const sykmeldtHarOppfolgingsplan = (oppfolgingsplaner: Oppfolgingsplan[] | undefined): boolean => {
    if (!oppfolgingsplaner) {
        return false
    }
    return oppfolgingsplaner.length > 0
}

export const skalViseOppfoelgingsplanLenke = (
    sykmeldinger: Sykmelding[] | undefined,
    oppfolgingsplaner: Oppfolgingsplan[] | undefined,
): boolean => {
    return sykmeldtHarGyldigSykmelding(sykmeldinger) || sykmeldtHarOppfolgingsplan(oppfolgingsplaner)
}
