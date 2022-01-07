import { useQuery } from 'react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<DialogmoteBehov, Error>('dialogmoteBehov', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/syfomotebehov/api/v2/arbeidstaker/motebehov`,
            async(data) => {
                return data as DialogmoteBehov
            },
        ),
    )
}

