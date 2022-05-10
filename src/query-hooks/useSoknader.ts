import { useQuery } from 'react-query'

import { Soknad } from '../types/soknad'
import { backendSoknadApp, flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseSoknader() {
    return useQuery<Soknad[], Error>('soknader', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/${backendSoknadApp()}/api/soknader`,
            async (data) => {
                return data as Soknad[]
            }
        )
    )
}
