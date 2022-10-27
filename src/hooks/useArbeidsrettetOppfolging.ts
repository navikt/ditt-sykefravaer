import { useQuery } from 'react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { fetchJson } from '../utils/fetch'

export default function UseArbeidsrettetOppfolging() {
    return useQuery<ArbeidsrettetOppfolging, Error>('arbeidsrettetOppfolging', () =>
        fetchJson('/syk/sykefravaer/api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging', {
            headers: {
                'Nav-Consumer-Id': 'sykefravaer',
            },
        }),
    )
}
