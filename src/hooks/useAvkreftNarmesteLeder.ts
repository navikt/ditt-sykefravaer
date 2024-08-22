import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseAvkreftNarmesteLeder(org: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()

    return useMutation({
        mutationFn: () =>
            fetchMedRequestId(`/syk/sykefravaer/api/narmesteleder/v2/${org}/avkreft` + testpersonQuery.query(), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),

        onSuccess: () => {
            setTimeout(
                () =>
                    queryClient.invalidateQueries({
                        queryKey: ['narmesteledere'],
                    }),
                200,
            )
        },
    })
}
