import { useQuery } from 'react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import { syfoApiRoot } from '../utils/environment'
import { fetchJson } from '../utils/fetch'

export default function UseOppfolgingsplaner() {
    return useQuery<Oppfolgingsplan[], Error>('oppfolgingsplaner', () =>
        fetchJson(
            `${syfoApiRoot()}/syfooppfolgingsplanservice/api/arbeidstaker/oppfolgingsplaner`,
            {
                credentials: 'include',
            },
            true
        )
    )
}
