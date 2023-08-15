import { useQuery } from '@tanstack/react-query'

import { Sykmelding } from '../types/sykmelding'
import { fetchJson } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseSykmeldinger() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Sykmelding[], Error>({
        queryKey: ['sykmeldinger'],
        queryFn: () =>
            fetchJson('/syk/sykefravaer/api/sykmeldinger-backend/api/v2/sykmeldinger' + testpersonQuery.query()),
    })
}
