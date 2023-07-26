import { useQuery } from '@tanstack/react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { fetchJson } from '../utils/fetch'

export default function UseArbeidsrettetOppfolging() {
    return useQuery<ArbeidsrettetOppfolging, Error>({
        queryKey: ['arbeidsrettetOppfolging'],
        queryFn: () =>
            fetchJson('/syk/sykefravaer/api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging', {
                headers: {
                    'Nav-Consumer-Id': 'sykefravaer',
                },
            }),
    })
}
