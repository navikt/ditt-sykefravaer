import { useQuery } from 'react-query'

import { Brev } from '../types/brev'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Brev[], Error>('brev', () =>
        Fetch.authenticatedGet(
            `${env.isdialogmoteRoot()}/api/v1/narmesteleder/brev`,
            async(data) => {
                return data as Brev[]
            },
        ),
    )
}
