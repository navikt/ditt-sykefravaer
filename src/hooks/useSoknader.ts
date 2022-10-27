import { useQuery } from 'react-query'

import { Soknad } from '../types/soknad'
import { fetchJson } from '../utils/fetch'

export default function UseSoknader() {
    return useQuery<Soknad[], Error>('soknader', () =>
        fetchJson('/syk/sykefravaer/api/sykepengesoknad-backend/api/v2/soknader'),
    )
}
