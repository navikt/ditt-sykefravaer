import { useQuery } from 'react-query'

import { Brev } from '../types/brev'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Brev[], Error>('brev', () =>
        Fetch.authenticatedGet(
            `${env.loginServiceRedirectUrl()}/api/v1/arbeidstaker/brev`, //TODO: URL, do we need proxy?
            async(data) => {
                return data as Brev[]
            },
        ),
    )
}
