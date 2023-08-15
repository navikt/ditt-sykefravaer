import { useQuery } from '@tanstack/react-query'

import { DialogmoteBehov } from '../types/dialogmoteBehov'
import { fetchJson } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseDialogmoteBehov() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<DialogmoteBehov, Error>({
        queryKey: ['dialogmoteBehov'],
        queryFn: () =>
            fetchJson(
                '/syk/sykefravaer/api/syfomotebehov/syfomotebehov/api/v3/arbeidstaker/motebehov' +
                    testpersonQuery.query(),
            ),
    })
}
