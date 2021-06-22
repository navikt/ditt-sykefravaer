import { useQuery } from 'react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

export default function() {
    return useQuery<boolean, Error>('arbeidsrettetOppfolging', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/syfosoknad/api/syfosyketilfelle/39ukersvarsel`,
            async(data) => {
                return data as boolean
            },
        ),
    )
}

