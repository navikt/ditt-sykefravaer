import { useQuery } from '@tanstack/react-query'

import { Soknad } from '../types/soknad'
import { fetchJson } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseSoknader() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Soknad[], Error>({
        queryKey: ['soknader'],
        queryFn: () =>
            fetchJson(
                '/syk/sykefravaer/api/sykepengesoknad-backend/api/v2/soknader/metadata' + testpersonQuery.query(),
            ),
    })
}
