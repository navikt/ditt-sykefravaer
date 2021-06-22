import { useQuery } from 'react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

export default function() {
    return useQuery<Oppfolgingsplan[], Error>('oppfolgingsplaner', () =>
        Fetch.authenticatedGet(
            `${env.syfoApiRoot}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
            async(data) => {
                return data as Oppfolgingsplan[]
            },
        ),
    )
}

