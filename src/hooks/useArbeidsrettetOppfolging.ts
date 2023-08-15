import { useQuery } from '@tanstack/react-query'

import { ArbeidsrettetOppfolging } from '../types/arbeidsrettetOppfolging'
import { fetchJson } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseArbeidsrettetOppfolging() {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<ArbeidsrettetOppfolging, Error>({
        queryKey: ['arbeidsrettetOppfolging'],
        queryFn: () =>
            fetchJson(
                '/syk/sykefravaer/api/veilarboppfolging/veilarboppfolging/api/v2/oppfolging' + testpersonQuery.query(),
                {
                    headers: {
                        'Nav-Consumer-Id': 'sykefravaer',
                    },
                },
            ),
    })
}
