import { useQuery } from 'react-query'

import { SimpleHendelse } from '../types/hendelse'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<SimpleHendelse[], Error>('hendelser', () =>
        Fetch.authenticatedGet(
            `${env.syfoApiRoot}/syfoservicestrangler/api/hendelse/hendelser`,
            async(data) => {
                return data as SimpleHendelse[]
            },
        ),
    )
}

