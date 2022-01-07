import { useMutation, useQueryClient } from 'react-query'

import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(() =>
        Fetch.authenticatedPost(
            `${flexGatewayRoot()}/syfoservicestrangler/api/hendelse/bekreft-aktivitetskrav`
        ), { onSuccess: () => queryClient.invalidateQueries('hendelser') }
    )
}
