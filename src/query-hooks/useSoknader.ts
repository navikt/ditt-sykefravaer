import { useQuery } from 'react-query'

import { Soknad } from '../types/soknad'
import Fetch from '../utils/fetch'

export default function UseSoknader() {
    return useQuery<Soknad[], Error>('soknader', () =>
        Fetch.authenticatedGet('/syk/sykefravaer/api/v1/soknader', async (data) => {
            return data as Soknad[]
        })
    )
}
