import { useQuery } from '@tanstack/react-query'

import { RSVedtakWrapper } from '../types/vedtak'
import { fetchJson } from '../utils/fetch'

export default function UseVedtak() {
    return useQuery<RSVedtakWrapper[], Error>({
        queryKey: ['vedtak'],
        queryFn: () => fetchJson('/syk/sykefravaer/api/spinnsyn-backend/api/v3/vedtak'),
    })
}
