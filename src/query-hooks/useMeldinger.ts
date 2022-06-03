import { useQuery } from 'react-query'

import { Melding } from '../types/melding'
import Fetch from '../utils/fetch'

export default function UseMeldinger() {
    return useQuery<Melding[], Error>('meldinger', () =>
        Fetch.authenticatedGet(
            '/syk/sykefravaer/api/v1/meldinger',
            async (data) => {
                return data as Melding[]
            }
        )
    )
}
