import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { Sykmelding } from '../types/sykmelding'
import { isMockBackend } from '../utils/environment'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function useSykmeldinger(): UseQueryResult<Sykmelding[], Error> {
    const { demoQuery, demoQueryKey } = UseDemoDataForSykmeldingerEndepunkt()

    return useQuery<Sykmelding[], Error>({
        queryKey: ['sykmeldinger-flex', demoQueryKey],
        queryFn: () =>
            fetchJsonMedRequestId('/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger' + demoQuery),
    })
}

function UseDemoDataForSykmeldingerEndepunkt(): {
    demoQuery: string
    demoQueryKey?: string
} {
    const testpersonQuery = UseTestpersonQuery()
    const router = useRouter()

    if (!isMockBackend()) {
        return {
            demoQuery: '',
        }
    }

    const isSykmeldingerRoute = router.route.startsWith('/sykmeldinger')
    const subApp: 'sykmeldinger' | 'ditt-sykefravaer' = isSykmeldingerRoute ? 'sykmeldinger' : 'ditt-sykefravaer'
    const demoQuery = `?mock-data-kilde=${subApp}` + testpersonQuery.query(true)

    return {
        demoQuery,
        demoQueryKey: subApp,
    }
}
