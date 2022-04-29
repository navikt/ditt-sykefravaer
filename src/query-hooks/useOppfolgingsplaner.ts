import { useQuery } from 'react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import { syfoApiRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseOppfolgingsplaner() {
    return useQuery<Oppfolgingsplan[], Error>('oppfolgingsplaner', () =>
        Fetch.authenticatedGet(
            `${syfoApiRoot()}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
            async(data) => {
                return data as Oppfolgingsplan[]
            },
        ),
    )
}

