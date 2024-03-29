import { useQuery } from '@tanstack/react-query'

import { Oppfolgingsplan } from '../types/oppfolgingsplan'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseOppfolgingsplaner() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Oppfolgingsplan[], Error>({
        queryKey: ['oppfolgingsplaner'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/syfooppfolgingsplanservice/syfooppfolgingsplanservice/api/v2/arbeidstaker/oppfolgingsplaner' +
                    testpersonQuery.query(),
            ),
    })
}
