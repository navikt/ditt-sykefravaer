import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchMedRequestId } from '../utils/fetch'

export default function UseAvkreftNarmesteLeder(org: string) {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(
        () =>
            fetchMedRequestId(`/syk/sykefravaer/api/narmesteleder/v2/${org}/avkreft`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        {
            onSuccess: () => {
                setTimeout(() => queryClient.invalidateQueries(['narmesteledere']), 200)
            },
        },
    )
}
