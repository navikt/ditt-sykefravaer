import { useQuery } from 'react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { fetchJson } from '../utils/fetch'

export default function UseDialogmoteBehov() {
    return useQuery<DialogmoteBehov, Error>('dialogmoteBehov', () =>
        fetchJson('/syk/sykefravaer/api/v1/syfomotebehov/arbeidstaker/motebehov')
    )
}
