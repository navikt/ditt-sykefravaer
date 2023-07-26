import { useQuery } from '@tanstack/react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { fetchJson } from '../utils/fetch'

export default function UseDialogmoteBehov() {
    return useQuery<DialogmoteBehov, Error>({
        queryKey: ['dialogmoteBehov'],
        queryFn: () => fetchJson('/syk/sykefravaer/api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov'),
    })
}
