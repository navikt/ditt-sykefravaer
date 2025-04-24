import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { Sykmelding } from '../types/sykmelding'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseSykmeldingerFlex(): UseQueryResult<Sykmelding[], Error> {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Sykmelding[], Error>({
        queryKey: ['sykmeldinger-flex'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger' + testpersonQuery.query(),
            ),
    })
}
