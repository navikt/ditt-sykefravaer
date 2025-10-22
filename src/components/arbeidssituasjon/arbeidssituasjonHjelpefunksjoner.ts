import { NarmesteLeder } from '../../types/narmesteLeder'
import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { selectSykmeldingerYngreEnnTreMaaneder } from '../../utils/sykmeldingerUtils'

export const finnAktuelleArbeidsgivere = (
    narmesteLedere?: NarmesteLeder[],
    sykmeldinger?: DittSykefravaerSykmelding[],
) => {
    let aktiveLedereOrgnummer: string[] = []
    let sykmeldingerMedAktivNaermesteLeder: DittSykefravaerSykmelding[] = []
    let sykmeldingerFiltrertPaPeriode: DittSykefravaerSykmelding[] = []

    if (narmesteLedere) {
        aktiveLedereOrgnummer = narmesteLedere.filter((nl) => !nl.aktivTom && nl.navn).map((nl) => nl.orgnummer)
    }
    if (sykmeldinger) {
        sykmeldingerMedAktivNaermesteLeder = sykmeldinger
            .filter((syk) => syk.sykmeldingStatus.statusEvent === 'SENDT')
            .filter((syk) => aktiveLedereOrgnummer.includes(syk.sykmeldingStatus.arbeidsgiver?.orgnummer || ''))

        sykmeldingerFiltrertPaPeriode = selectSykmeldingerYngreEnnTreMaaneder(sykmeldinger).filter(
            (syk) => syk.sykmeldingStatus.statusEvent === 'SENDT',
        )
    }

    const sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel: DittSykefravaerSykmelding[] = [
        ...sykmeldingerFiltrertPaPeriode,
        ...sykmeldingerMedAktivNaermesteLeder,
    ]

    const unikeArbeidsgiver = new Set(
        sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel
            .filter((syk) => syk.sykmeldingStatus.arbeidsgiver)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((syk) => syk.sykmeldingStatus.arbeidsgiver!.orgnummer),
    )

    return Array.from(unikeArbeidsgiver)
}
