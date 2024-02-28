import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseMaxdate(enabled: boolean) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<MaxDate, Error>({
        enabled,
        queryKey: ['maxdate'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/esyfovarsel/api/v1/sykepenger/maxdate?isoformat=true' +
                    testpersonQuery.query(true),
            ),
    })
}

export interface MaxDate {
    maxDate: string | null
    utbetaltTom: string | null
}
