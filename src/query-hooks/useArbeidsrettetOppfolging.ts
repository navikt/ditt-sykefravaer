import { useQuery } from 'react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<ArbeidsrettetOppfolging, Error>('arbeidsrettetOppfolging', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/veilarboppfolging/api/oppfolging`,
            async(data) => {
                return data as ArbeidsrettetOppfolging
            },
            { 'Nav-Consumer-Id': 'sykefravaer' }
        ),
    )
}

