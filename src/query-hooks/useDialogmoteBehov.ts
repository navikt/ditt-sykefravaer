import { useQuery } from 'react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { syfoApiRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseDialogmoteBehov() {
    return useQuery<DialogmoteBehov, Error>('dialogmoteBehov', () =>
        Fetch.authenticatedGet('/syk/sykefravaer/api/v1/syfomotebehov/arbeidstaker/motebehov', async (data) => {
            return data as DialogmoteBehov
        })
    )
}
