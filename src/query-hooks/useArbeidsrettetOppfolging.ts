import { useQuery } from 'react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

export default function() {
    return useQuery<ArbeidsrettetOppfolging, Error>('vedtak', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/veilarboppfolging/api/oppfolging`,
            async(data) => {
                return data as ArbeidsrettetOppfolging
            },
        ),
    )
}

