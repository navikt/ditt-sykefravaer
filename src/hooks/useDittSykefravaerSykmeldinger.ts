import { UseQueryResult } from '@tanstack/react-query'

import { DittSykefravaerSykmelding } from '../types/dittSykefravaerSykmelding'
import { Sykmelding } from '../types/sykmelding'

import useSykmeldinger from './useSykmeldinger'

export default function useDittSykefravaerSykmeldinger(): UseQueryResult<DittSykefravaerSykmelding[], Error> {
    const { data, ...rest } = useSykmeldinger()
    const konvertertData = data && konverterTilTsmSykmeldinger(data)
    return { data: konvertertData, ...rest } as UseQueryResult<DittSykefravaerSykmelding[], Error>
}

function konverterTilTsmSykmeldinger(sykmeldinger: Sykmelding[]): DittSykefravaerSykmelding[] {
    return sykmeldinger.map((sykmelding) => ({
        ...sykmelding,
        sykmeldingStatus: {
            ...sykmelding.sykmeldingStatus,
            arbeidsgiver: sykmelding.sykmeldingStatus.arbeidsgiver || undefined,
        },
    }))
}
