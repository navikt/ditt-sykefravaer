import { useQuery } from '@tanstack/react-query'

import { Sykmelding } from '../types/sykmelding'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseSykmeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Sykmelding[], Error>({
        queryKey: ['sykmeldinger'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/sykmeldinger-backend/api/v2/sykmeldinger' + testpersonQuery.query(),
            ),
    })
}
