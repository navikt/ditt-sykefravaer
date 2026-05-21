import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'

interface HarSoknadResponse {
    harSoknad: boolean
}

export default function useHarSoknad(sykmeldingId: string, enabled: boolean): UseQueryResult<HarSoknadResponse, Error> {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<HarSoknadResponse, Error>({
        queryKey: ['har-soknad', sykmeldingId],
        queryFn: async () => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/har-soknad' +
                    testpersonQuery.query(),
            )
        },
        enabled,
    })
}
