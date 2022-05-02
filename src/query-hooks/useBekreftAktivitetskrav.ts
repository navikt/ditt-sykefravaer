import { useMutation, useQueryClient } from 'react-query'

import { syfoApiRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseBekreftAktivitetskrav() {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error>(
        () =>
            Fetch.authenticatedPost(
                `${syfoApiRoot()}/syfoservicestrangler/api/hendelse/bekreft-aktivitetskrav`
            ),
        { onSuccess: () => queryClient.invalidateQueries('hendelser') }
    )
}
