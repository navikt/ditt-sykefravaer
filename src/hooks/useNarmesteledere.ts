import { useQuery } from '@tanstack/react-query'

import { LinemanagerResponse, NarmesteLeder, tilNarmesteLeder } from '../types/narmesteLeder'
import { fetchJsonMedRequestId } from '../utils/fetch'
import { isMockBackend } from '../utils/environment'

import { UseTestpersonQuery } from './useTestpersonQuery'

const cacheTestperson = (testperson: string) => (isMockBackend() ? testperson || '?testperson=default' : '')
export const narmesteledereKey = (testperson: string) => ['narmesteledere', cacheTestperson(testperson)] as const
export default function UseNarmesteledere() {
    const testpersonQuery = UseTestpersonQuery()
    const testperson = testpersonQuery.query()

    return useQuery<NarmesteLeder[], Error>({
        queryKey: narmesteledereKey(testperson),
        queryFn: async ({ signal }) => {
            const res: LinemanagerResponse = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/narmesteleder/employee/linemanager' + testperson,
                { signal },
            )
            signal.throwIfAborted()
            return res.linemanagers.map(tilNarmesteLeder)
        },
    })
}
