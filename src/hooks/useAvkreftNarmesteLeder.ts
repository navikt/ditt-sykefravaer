import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchMedRequestId } from '../utils/fetch'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseAvkreftNarmesteLeder(id: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()

    return useMutation({
        mutationFn: () =>
            fetchMedRequestId(`/syk/sykefravaer/api/narmesteleder/linemanager/${id}` + testpersonQuery.query(), {
                method: 'DELETE',
                credentials: 'include',
            }),

        // Esyfo svarer 202 og fullfører avkreftingen asynkront via Kafka. Vi henter derfor ikke listen på nytt,
        // siden svaret da kan inneholde lederen igjen. Lederen fjernes bare fra cachen.
        onSuccess: () => {
            queryClient.setQueryData<NarmesteLeder[]>(['narmesteledere'], (liste) =>
                liste?.filter((nl) => nl.id !== id),
            )
        },
    })
}
