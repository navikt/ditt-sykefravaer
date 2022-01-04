import { useQuery } from 'react-query'

import { DialogMote } from '../types/dialogmote'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<DialogMote, Error>('dialogmoter', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/syfomoteadmin/api/bruker/arbeidstaker/moter/siste`,
            async(data) => {
                return data as DialogMote
            },
        ),
    )
}

