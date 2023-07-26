import { useQuery } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchJson } from '../utils/fetch'

export default function UseNarmesteledere() {
    return useQuery<NarmesteLeder[], Error>({
        queryKey: ['narmesteledere'],
        queryFn: () => fetchJson('/syk/sykefravaer/api/narmesteleder/user/v2/sykmeldt/narmesteledere'),
    })
}
