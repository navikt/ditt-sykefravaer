import { useQuery } from '@tanstack/react-query'

import { TidligereArbeidsgivereArray } from 'queries'

import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function useTidligereArbeidsgivereById(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<TidligereArbeidsgivereArray, Error>({
        queryKey: ['tidligere-arbeidsgivere', sykmeldingId],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/tidligere-arbeidsgivere' +
                    testpersonQuery.query(),
            ),
    })
}
