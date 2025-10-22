import { UseQueryResult } from '@tanstack/react-query'

import { TsmSykmelding } from '../types/tsmSykmelding'
import { Sykmelding } from '../types/sykmelding'

import useSykmeldinger from './useSykmeldinger'

export default function useDittSykefravaerSykmeldinger(): UseQueryResult<TsmSykmelding[], Error> {
    const { data, ...rest } = useSykmeldinger()
    const konvertertData = data && konverterTilTsmSykmeldinger(data)
    return { data: konvertertData, ...rest } as UseQueryResult<TsmSykmelding[], Error>
}

function konverterTilTsmSykmeldinger(sykmeldinger: Sykmelding[]): TsmSykmelding[] {
    return sykmeldinger.map((sykmelding) => ({
        ...sykmelding,
        sykmeldingStatus: {
            ...sykmelding.sykmeldingStatus,
            arbeidsgiver: sykmelding.sykmeldingStatus.arbeidsgiver || undefined,
        },
    }))
}
