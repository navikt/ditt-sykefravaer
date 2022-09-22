import { useQuery } from 'react-query'

import { Brev } from '../types/brev'
import { fetchJson } from '../utils/fetch'

export default function UseBrev() {
    return useQuery<Brev[], Error>('brev', () =>
        fetchJson('/syk/sykefravaer/api/isdialogmote/api/v2/arbeidstaker/brev')
    )
}
