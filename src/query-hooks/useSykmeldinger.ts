import { useQuery } from 'react-query'

import { Sykmelding } from '../types/sykmelding'
import { sykmeldingerBackendRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseSykmeldinger() {
    return useQuery<Sykmelding[], Error>('sykmeldinger', () =>
        Fetch.authenticatedGet(
            `${sykmeldingerBackendRoot()}/api/v1/sykmeldinger`,
            async (maybeSykmeldinger) => {
                return maybeSykmeldinger as Sykmelding[]
            }
        )
    )
}
