import { useQuery } from 'react-query'

import { Soknad } from '../types/soknad'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseSoknader() {
    return useQuery<Soknad[], Error>('soknader', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/syfosoknad/api/soknader`,
            async (data) => {
                return data as Soknad[]
            }
        )
    )
}
