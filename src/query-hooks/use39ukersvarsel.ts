import { useQuery } from 'react-query'

import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<boolean, Error>('39ukersvarsel', () =>
        Fetch.authenticatedGet(
            `${env.syfoApiRoot()}/syfomotebehov/api/esyfovarsel/39uker`,
            async(data) => {
                return data as boolean
            },
        ),
    )
}

