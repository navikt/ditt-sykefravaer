import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'
import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'

interface HarSoknadResponse {
    harSoknad: boolean
}

export default function useHarSoknad(
    sykmeldingId: string,
    arbeidssituasjon: ArbeidssituasjonType,
    enabled: boolean,
): UseQueryResult<HarSoknadResponse, Error> {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<HarSoknadResponse, Error>({
        queryKey: ['har-soknad', sykmeldingId, arbeidssituasjon],
        queryFn: async () => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/har-soknad/' +
                    arbeidssituasjon +
                    testpersonQuery.query(),
            )
        },
        enabled,
    })
}
