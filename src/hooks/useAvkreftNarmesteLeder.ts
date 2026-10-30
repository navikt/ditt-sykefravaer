import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchMedRequestId } from '../utils/fetch'

import { registrerAvkreftetLeder } from './useNarmesteledere'
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

        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ['narmesteledere'],
            })
        },

        onSuccess: async () => {
            await queryClient.cancelQueries({
                queryKey: ['narmesteledere'],
            })
            registrerAvkreftetLeder(queryClient, id)
            queryClient.setQueryData<NarmesteLeder[]>(['narmesteledere'], (liste) =>
                liste?.filter((nl) => nl.id !== id),
            )
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ['narmesteledere'],
                })
            }, 200)
        },
    })
}
