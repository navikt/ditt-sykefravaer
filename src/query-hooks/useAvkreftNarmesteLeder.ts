import { useMutation, useQueryClient } from 'react-query'

import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function(org: string) {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(
        () => {
            return Fetch.authenticatedPost(
                `${env.narmestelederUrl}/${org}/avkreft`
            )
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('narmesteledere')
            }
        }
    )
}

