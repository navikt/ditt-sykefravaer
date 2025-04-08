import { NarmesteLeder } from '../../types/narmesteLeder'
import { TsmSykmelding } from '../../types/tsmSykmelding'
import { selectSykmeldingerYngreEnnTreMaaneder } from '../../utils/sykmeldingerUtils'

export const finnAktuelleArbeidsgivere = (narmesteLedere?: NarmesteLeder[], sykmeldinger?: TsmSykmelding[]) => {
    let aktiveLedereOrgnummer: string[] = []
    let sykmeldingerMedAktivNaermesteLeder: TsmSykmelding[] = []
    let sykmeldingerFiltrertPaPeriode: TsmSykmelding[] = []

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

    const sykmeldingerMedAktivLederEllerMindreEnnTreMaanederGammel: TsmSykmelding[] = [
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
