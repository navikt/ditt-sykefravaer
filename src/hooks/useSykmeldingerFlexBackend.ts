import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'
import { Sykmelding } from '../types/sykmelding'

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
