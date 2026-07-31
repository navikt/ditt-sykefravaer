import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { erSykmeldingGyldigForOppfolgingMedGrensedato } from '../../utils/erSykmeldingGyldigForOppfolgingMedGrensedato'

const sykmeldtHarGyldigSykmeldingMedArbeidsgiver = (
    sykmeldinger: DittSykefravaerSykmelding[] | undefined,
    dagensDato: Date,
): boolean => {
    if (!sykmeldinger) {
        return false
    }
    return sykmeldinger.some(
        (sykmelding) =>
            Boolean(sykmelding.sykmeldingStatus.arbeidsgiver?.orgnummer) &&
            erSykmeldingGyldigForOppfolgingMedGrensedato(sykmelding, dagensDato),
    )
}

export const skalViseOppfoelgingsplanLenke = (
    sykmeldinger: DittSykefravaerSykmelding[] | undefined,
    dagensDato: Date,
): boolean => {
    return sykmeldtHarGyldigSykmeldingMedArbeidsgiver(sykmeldinger, dagensDato)
}
