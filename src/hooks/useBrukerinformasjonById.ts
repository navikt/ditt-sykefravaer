import { useQuery } from '@tanstack/react-query'

import { Brukerinformasjon } from 'queries'

import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function useBrukerInformasjonById(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Brukerinformasjon, Error>({
        queryKey: ['brukerinformasjon', sykmeldingId],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/brukerinformasjon' +
                    testpersonQuery.query(),
            ),
    })
}
