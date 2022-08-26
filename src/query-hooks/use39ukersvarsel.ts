import { useQuery } from 'react-query'

import { syfoApiRoot } from '../utils/environment'
import { fetchJson } from '../utils/fetch'

export default function Use39ukersvarsel() {
    return useQuery<boolean, Error>('39ukersvarsel', () =>
        fetchJson(`${syfoApiRoot()}/syfomotebehov/api/esyfovarsel/39uker`, { credentials: 'include' }, true)
    )
}
