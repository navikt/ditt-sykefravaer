import { useQuery } from '@tanstack/react-query'

import { Sykmelding } from '../types/sykmelding'
import { fetchJson } from '../utils/fetch'

export default function UseSykmeldinger() {
    return useQuery<Sykmelding[], Error>({
        queryKey: ['sykmeldinger'],
        queryFn: () => fetchJson('/syk/sykefravaer/api/sykmeldinger-backend/api/v2/sykmeldinger'),
    })
}
