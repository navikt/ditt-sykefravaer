import { useQuery } from 'react-query'

import { Soknad } from '../types/soknad'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Soknad[], Error>('soknader', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/syfosoknad/api/soknader`,
            async(data) => {
                return data as Soknad[]
            },
        ),
    )
}

