import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'

export default function useErUtenforVentetid(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<UtenforVentetid, Error>({
        queryKey: ['er-utenfor-ventetid', sykmeldingId],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/er-utenfor-ventetid' +
                    testpersonQuery.query(),
            ),
    })
}

interface UtenforVentetid {
    erUtenforVentetid: boolean
    oppfolgingsdato?: string
}
