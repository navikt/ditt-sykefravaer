import { useQuery } from 'react-query'

import { Sykeforloep } from '../types/sykeforloep'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Sykeforloep[], Error>('sykeforloep', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/syfosoknad/api/sykeforloep`,
            async(data) => {
                return data as Sykeforloep[]
            },
        ),
    )
}

