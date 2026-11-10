import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchMedRequestId } from '../utils/fetch'

import { narmesteledereKey } from './useNarmesteledere'
import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseAvkreftNarmesteLeder(id: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()
    const testperson = testpersonQuery.query()

    const mutation = useMutation({
        mutationFn: ({ id, testperson }: { id: string; testperson: string }) =>
            fetchMedRequestId(`/syk/sykefravaer/api/narmesteleder/linemanager/${id}` + testperson, {
                method: 'DELETE',
                credentials: 'include',
            }),

        // Oppdaterer cachen optimistisk etter 202, siden avkreftingen behandles asynkront via Kafka.
        // Unngår refetch som kan hente tilbake relasjonen før backend-tilstanden er oppdatert.
        onSuccess: (_, { id, testperson }) => {
            queryClient.setQueryData<NarmesteLeder[]>(narmesteledereKey(testperson), (liste) =>
                liste?.filter((nl) => nl.id !== id),
            )
        },
    })

    const variabler = () => ({ id, testperson })

    return {
        ...mutation,
        mutate: () => mutation.mutate(variabler()),
        mutateAsync: () => mutation.mutateAsync(variabler()),
    }
}
