import { useQuery } from '@tanstack/react-query'

import { TsmSykmelding } from '../types/tsmSykmelding'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseTsmSykmeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<TsmSykmelding[], Error>({
        queryKey: ['sykmeldinger'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/sykmeldinger-backend/api/v2/sykmeldinger' + testpersonQuery.query(),
            ),
    })
}
