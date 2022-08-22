import { useQuery } from 'react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import Fetch from '../utils/fetch'

export default function UseNarmesteledere() {
    return useQuery<NarmesteLeder[], Error>('narmesteledere', () =>
        Fetch.authenticatedGet('/syk/sykefravaer/api/v1/narmesteledere', async (data) => {
            return data as NarmesteLeder[]
        })
    )
}
