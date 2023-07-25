import { useQuery } from '@tanstack/react-query'

import { Melding } from '../types/melding'
import { fetchJson } from '../utils/fetch'

export default function UseMeldinger() {
    return useQuery<Melding[], Error>({
        queryKey: ['meldinger'],
        queryFn: () => fetchJson('/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/meldinger'),
    })
}
