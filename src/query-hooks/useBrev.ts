import { useQuery } from 'react-query'

import { Brev } from '../types/brev'
import env from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Brev[], Error>('brev', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot()}/isdialogmote/api/v1/arbeidstaker/brev`,
            async(data) => {
                return data as Brev[]
            },
        ),
    )
}
