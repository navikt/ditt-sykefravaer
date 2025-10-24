import { UseQueryResult } from '@tanstack/react-query'

import { DittSykefravaerSykmelding } from '../types/dittSykefravaerSykmelding'

import useSykmeldinger from './sykmelding/useSykmeldinger'

export default function useDittSykefravaerSykmeldinger(): UseQueryResult<DittSykefravaerSykmelding[], Error> {
    return useSykmeldinger()
}
