import { useQuery } from 'react-query'

import { SimpleHendelse } from '../types/hendelse'
import { syfoApiRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseHendelser() {
    return useQuery<SimpleHendelse[], Error>('hendelser', () =>
        Fetch.authenticatedGet(
            `${syfoApiRoot()}/syfoservicestrangler/api/hendelse/hendelser`,
            async (data) => {
                return data as SimpleHendelse[]
            }
        )
    )
}
