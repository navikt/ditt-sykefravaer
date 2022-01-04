import { useQuery } from 'react-query'

import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<boolean, Error>('39ukersvarsel', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/syfomotebehov/api/esyfovarsel/39uker`,
            async(data) => {
                return data as boolean
            },
        ),
    )
}

