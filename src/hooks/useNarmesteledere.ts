import { useQuery } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseNarmesteledere() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<NarmesteLeder[], Error>({
        queryKey: ['narmesteledere'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/narmesteleder/user/v2/sykmeldt/narmesteledere' + testpersonQuery.query(),
            ),
    })
}
