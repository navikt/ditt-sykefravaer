import { useQuery } from 'react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Oppfolgingsplan[], Error>('oppfolgingsplaner', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
            async(data) => {
                return data as Oppfolgingsplan[]
            },
        ),
    )
}

