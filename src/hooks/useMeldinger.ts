import { useQuery } from 'react-query'

import { Melding } from '../types/melding'
import { fetchJson } from '../utils/fetch'

export default function UseMeldinger() {
    return useQuery<Melding[], Error>('meldinger', () =>
        fetchJson('/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/meldinger'),
    )
}
