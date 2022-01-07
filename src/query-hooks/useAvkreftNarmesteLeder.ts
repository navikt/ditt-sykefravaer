import { useMutation, useQueryClient } from 'react-query'

import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function(org: string) {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(() =>
        Fetch.authenticatedPost(
            `${flexGatewayRoot()}/${org}/avkreft`
        ), { onSuccess: () => queryClient.invalidateQueries('narmesteledere') }
    )
}

