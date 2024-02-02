import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { InntektsmeldingTyper } from '../types/inntektsmeldingTyper'

import { UseTestpersonQuery } from './useTestpersonQuery'

export function useInntektsmeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<InntektsmeldingTyper[], Error>({
        queryKey: ['inntektsmeldinger'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/inntektsmeldinger' + testpersonQuery.query(),
            ),
    })
}
