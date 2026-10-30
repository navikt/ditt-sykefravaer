import { useQuery } from '@tanstack/react-query'

import { LinemanagerResponse, NarmesteLeder, tilNarmesteLeder } from '../types/narmesteLeder'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseNarmesteledere() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<NarmesteLeder[], Error>({
        queryKey: ['narmesteledere'],
        queryFn: async () => {
            const res: LinemanagerResponse = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/narmesteleder/internal/api/v1/employee/linemanager' + testpersonQuery.query(),
            )
            return res.linemanagers.map(tilNarmesteLeder)
        },
    })
}
