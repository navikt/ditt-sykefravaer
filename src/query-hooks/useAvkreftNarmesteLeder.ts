import { useMutation, useQueryClient } from 'react-query'

import { narmestelederUrl } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseAvkreftNarmesteLeder(org: string) {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(() =>
        Fetch.authenticatedPost(
            `${narmestelederUrl()}/${org}/avkreft`
        ), { onSuccess: () => queryClient.invalidateQueries('narmesteledere') }
    )
}

