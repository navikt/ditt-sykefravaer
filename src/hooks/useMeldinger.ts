import { useQuery } from '@tanstack/react-query'

import { Melding } from '../types/melding'
import { fetchJson } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseMeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Melding[], Error>({
        queryKey: ['meldinger'],
        queryFn: () =>
            fetchJson('/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/meldinger' + testpersonQuery.query()),
    })
}
