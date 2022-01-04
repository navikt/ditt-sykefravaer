import { useQuery } from 'react-query'

import { Sykmelding } from '../types/sykmelding'
import { flexGatewayRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function() {
    return useQuery<Sykmelding[], Error>('sykmeldinger', () =>
        Fetch.authenticatedGet(
            `${flexGatewayRoot()}/api/v1/sykmeldinger`,
            async(maybeSykmeldinger) => {
                return maybeSykmeldinger as Sykmelding[]
            },
        ),
    )
}

