import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'

export default function useOptIn(sykmeldingId: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()

    return useMutation<unknown, Error, void>({
        mutationFn: async () => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/opt-in' +
                    testpersonQuery.query(),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['har-soknad', sykmeldingId],
            })
        },
    })
}
