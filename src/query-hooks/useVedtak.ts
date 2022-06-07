import { useQuery } from 'react-query'

import { RSVedtakWrapper } from '../types/vedtak'
import Fetch from '../utils/fetch'

export default function UseVedtak() {
    return useQuery<RSVedtakWrapper[], Error>('vedtak', () =>
        Fetch.authenticatedGet(
            '/syk/sykefravaer/api/v1/vedtak',
            async (data) => {
                return data as RSVedtakWrapper[]
            }
        )
    )
}
