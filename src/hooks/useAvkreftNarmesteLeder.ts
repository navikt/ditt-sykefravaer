import { useMutation, useQueryClient } from 'react-query'

import Fetch from '../utils/fetch'

export default function UseAvkreftNarmesteLeder(org: string) {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(
        () => Fetch.authenticatedPost(`/syk/sykefravaer/api/narmesteleder/v2/${org}/avkreft`),
        {
            onSuccess: () => {
                setTimeout(() => queryClient.invalidateQueries('narmesteledere'), 200)
            },
        },
    )
}
