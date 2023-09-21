import { useQuery } from '@tanstack/react-query'

import { fetchJson } from '../utils/fetch'
import { InntektsmeldingTyper } from '../types/inntektsmeldingTyper'
import { inntektsmeldingerEnabled } from '../utils/environment'

import { UseTestpersonQuery } from './useTestpersonQuery'

export function useInntektsmeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<InntektsmeldingTyper[], Error>({
        enabled: inntektsmeldingerEnabled(),
        queryKey: ['inntektsmeldinger'],
        queryFn: () =>
            fetchJson(
                '/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/inntektsmeldinger' + testpersonQuery.query(),
            ),
    })
}
