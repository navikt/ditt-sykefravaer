import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseAvkreftNarmesteLeder(id: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()

    return useMutation({
        mutationFn: () =>
            fetchMedRequestId(
                `/syk/sykefravaer/api/narmesteleder/internal/api/v1/linemanager/${id}` + testpersonQuery.query(),
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            ),

        onSuccess: () => {
            queryClient.setQueryData<NarmesteLeder[]>(['narmesteledere'], (liste) =>
                liste?.filter((nl) => nl.id !== id),
            )
            queryClient.invalidateQueries({
                queryKey: ['narmesteledere'],
            })
        },
    })
}
