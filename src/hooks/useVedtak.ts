import { useQuery } from '@tanstack/react-query'

import { RSVedtakWrapper } from '../types/vedtak'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseVedtak() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<RSVedtakWrapper[], Error>({
        queryKey: ['vedtak'],
        queryFn: () =>
            fetchJsonMedRequestId('/syk/sykefravaer/api/spinnsyn-backend/api/v3/vedtak' + testpersonQuery.query()),
    })
}
