import { useQuery } from '@tanstack/react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { fetchJsonMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseDialogmoteBehov() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<DialogmoteBehov, Error>({
        queryKey: ['dialogmoteBehov'],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov' +
                    testpersonQuery.query(),
            ),
    })
}
