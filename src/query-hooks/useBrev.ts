import { useQuery } from 'react-query'

import { Brev } from '../types/brev'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseBrev() {
    return useQuery<Brev[], Error>('brev', () =>
        Fetch.authenticatedGet(`${flexGatewayRoot()}/isdialogmote/api/v1/arbeidstaker/brev`, async (data) => {
            return data as Brev[]
        })
    )
}
