import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { TsmSykmelding } from '../../types/tsmSykmelding'
import { erSykmeldingGyldigForOppfolgingMedGrensedato } from '../../utils/erSykmeldingGyldigForOppfolgingMedGrensedato'
import { testDato } from '../../data/mock/mock-db/data-creators'

const sykmeldtHarGyldigSykmelding = (sykmeldinger: TsmSykmelding[] | undefined): boolean => {
    const tomGrenseDato = testDato
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
    sykmeldinger: TsmSykmelding[] | undefined,
    oppfolgingsplaner: Oppfolgingsplan[] | undefined,
): boolean => {
    return sykmeldtHarGyldigSykmelding(sykmeldinger) || sykmeldtHarOppfolgingsplan(oppfolgingsplaner)
}
