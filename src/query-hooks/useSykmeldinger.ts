import { useQuery } from 'react-query'

import { Sykmelding } from '../types/sykmelding'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

export default function() {
    return useQuery<Sykmelding[], Error>('sykmeldinger', () =>
        Fetch.authenticatedGet(
            `${env.sykmeldingerBackendProxyRoot}/api/v1/sykmeldinger`,
            async(maybeSykmeldinger) => {
                return maybeSykmeldinger as Sykmelding[]
            },
        ),
    )
}

