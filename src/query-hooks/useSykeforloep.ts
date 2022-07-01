import { useQuery } from 'react-query'

import { Sykeforloep } from '../types/sykeforloep'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseSykeforloep() {
    return useQuery<Sykeforloep[], Error>('sykeforloep', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/flex-syketilfelle/api/bruker/v1/sykeforloep`,
            async (data) => {
                return data as Sykeforloep[]
            }
        )
    )
}
