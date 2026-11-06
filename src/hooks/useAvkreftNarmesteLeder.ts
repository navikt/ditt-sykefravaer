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

        // Esyfo svarer 202 før avkreftingen er fullført. Oppdater cachen uten å hente listen på nytt.
        onSuccess: async (_, { id, testperson }) => {
            await queryClient.cancelQueries({ queryKey: narmesteledereKey(testperson), exact: true })
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
