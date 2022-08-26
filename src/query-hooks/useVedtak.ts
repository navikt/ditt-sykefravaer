import { useQuery } from 'react-query'

import { RSVedtakWrapper } from '../types/vedtak'
import { fetchJson } from '../utils/fetch'

export default function UseVedtak() {
    return useQuery<RSVedtakWrapper[], Error>('vedtak', () => fetchJson('/syk/sykefravaer/api/v1/vedtak'))
}
