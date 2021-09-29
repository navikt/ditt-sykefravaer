import { useQuery } from 'react-query'

import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<boolean, Error>('39ukersvarsel', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot()}/syfosoknad/api/syfosyketilfelle/39ukersvarsel`,
            async(data) => {
                return data as boolean
            },
        ),
    )
}

