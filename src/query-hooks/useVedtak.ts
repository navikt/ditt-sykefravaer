import { useQuery } from 'react-query'

import { RSVedtakWrapper } from '../types/vedtak'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseVedtak() {
    return useQuery<RSVedtakWrapper[], Error>('vedtak', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/spinnsyn-backend/api/v2/vedtak`,
            async (data) => {
                return data as RSVedtakWrapper[]
            }
        )
    )
}
