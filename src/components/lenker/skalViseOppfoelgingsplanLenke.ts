import { Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { TsmSykmelding } from '../../types/tsmSykmelding'
import { erSykmeldingGyldigForOppfolgingMedGrensedato } from '../../utils/erSykmeldingGyldigForOppfolgingMedGrensedato'

const sykmeldtHarGyldigSykmelding = (sykmeldinger: TsmSykmelding[] | undefined, dagensDato: Date): boolean => {
    if (!sykmeldinger) {
        return false
    }
    return (
        sykmeldinger
            .filter((sykmelding) => {
                return sykmelding.sykmeldingStatus.arbeidsgiver?.orgnummer !== null
            })
            .filter((sykmelding) => {
                return erSykmeldingGyldigForOppfolgingMedGrensedato(sykmelding, dagensDato)
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
    dagensDato: Date,
): boolean => {
    return sykmeldtHarGyldigSykmelding(sykmeldinger, dagensDato) || sykmeldtHarOppfolgingsplan(oppfolgingsplaner)
}
