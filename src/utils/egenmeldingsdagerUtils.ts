import * as R from 'remeda'

import {
    EgenmeldingsdagerFormValue,
    MAX_EGENMELDINGSDAGER,
} from '../components/FormComponents/Egenmelding/EgenmeldingerFieldHelpers'
import { SykmeldingStatus } from '../types/sykmelding/sykmelding'
import { YesOrNo } from '../types/sykmelding/sykmeldingCommon'

const hasMoreThan16Dates: (perioder: EgenmeldingsdagerFormValue[]) => boolean = R.piped(
    R.flatMap(R.prop('datoer')),
    R.filter(R.isTruthy),
    R.length(),
    (it) => it >= MAX_EGENMELDINGSDAGER,
)

export const hasCompletedEgenmeldingsdager = (egenmeldingsperioder?: EgenmeldingsdagerFormValue[] | null): boolean => {
    if (egenmeldingsperioder == null) return false

    const lastElement: EgenmeldingsdagerFormValue = egenmeldingsperioder[egenmeldingsperioder.length - 1]

    if (hasMoreThan16Dates(egenmeldingsperioder) && lastElement.hasClickedVidere) return true

    return lastElement.harPerioder === YesOrNo.NO
}

export function finnEgenmeldingsdager(brukerSvar: SykmeldingStatus['brukerSvar']): string[] | null {
    const svar = brukerSvar?.egenmeldingsdager?.svar
    if (!svar) {
        return null
    } else {
        return svar
    }
}
