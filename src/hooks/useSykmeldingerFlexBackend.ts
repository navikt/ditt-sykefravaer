import { useQuery } from '@tanstack/react-query'

import { SykmeldingFragment } from '../../src/fetching/graphql.generated'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseSykmeldingerFlex() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<SykmeldingFragment[], Error>({
        queryKey: ['sykmeldinger-flex'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger' + testpersonQuery.query(),
            ),
        retry: process.env.NODE_ENV === 'development' ? 0 : 3,
    })
}
