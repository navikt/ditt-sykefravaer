import { useQuery } from 'react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import { fetchJson } from '../utils/fetch'

export default function UseOppfolgingsplaner() {
    return useQuery<Oppfolgingsplan[], Error>('oppfolgingsplaner', () =>
        fetchJson(
            '/syk/sykefravaer/api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner',
        ),
    )
}
