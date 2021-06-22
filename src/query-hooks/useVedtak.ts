import { useQuery } from 'react-query'

import { RSVedtakWrapper } from '../types/rs-types/rs-vedtak'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

export default function() {
    return useQuery<RSVedtakWrapper[], Error>('vedtak', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/spinnsyn-backend/api/v2/vedtak`,
            async(data) => {
                return data as RSVedtakWrapper[]
            },
        ),
    )
}

