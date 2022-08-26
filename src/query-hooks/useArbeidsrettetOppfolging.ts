import { useQuery } from 'react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { flexGatewayRoot } from '../utils/environment'
import { fetchJson } from '../utils/fetch'

export default function UseArbeidsrettetOppfolging() {
    return useQuery<ArbeidsrettetOppfolging, Error>('arbeidsrettetOppfolging', () =>
        fetchJson(`${flexGatewayRoot()}/veilarboppfolging/api/v2/oppfolging`, {
            credentials: 'include',
            headers: {
                'Nav-Consumer-Id': 'sykefravaer',
            },
        })
    )
}
