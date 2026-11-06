import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NarmesteLeder } from '../types/narmesteLeder'
import { fetchMedRequestId } from '../utils/fetch'

import { narmesteledereKey, registrerAvkreftetLeder } from './useNarmesteledere'
import { UseTestpersonQuery } from './useTestpersonQuery'

export default function UseAvkreftNarmesteLeder(id: string, orgnummer?: string) {
    const queryClient = useQueryClient()
    const testpersonQuery = UseTestpersonQuery()
    const testperson = testpersonQuery.query()

    const mutation = useMutation({
        mutationFn: ({ id, testperson }: { id: string; testperson: string; orgnummer?: string }) =>
            fetchMedRequestId(`/syk/sykefravaer/api/narmesteleder/linemanager/${id}` + testperson, {
                method: 'DELETE',
                credentials: 'include',
            }),

        // Esyfo svarer 202 før avkreftingen er fullført. Skjul lederen også ved utdaterte GET-svar.
        onSuccess: async (_, { id, testperson, orgnummer }) => {
            registrerAvkreftetLeder(queryClient, testperson, id, orgnummer)
            await queryClient.cancelQueries({ queryKey: narmesteledereKey(testperson), exact: true })
            queryClient.setQueryData<NarmesteLeder[]>(narmesteledereKey(testperson), (liste) =>
                liste?.filter((nl) => nl.id !== id),
            )
        },
    })

    const variabler = () => ({
        id,
        testperson,
        orgnummer:
            orgnummer ??
            queryClient.getQueryData<NarmesteLeder[]>(narmesteledereKey(testperson))?.find((nl) => nl.id === id)
                ?.orgnummer,
    })

    return {
        ...mutation,
        mutate: () => mutation.mutate(variabler()),
        mutateAsync: () => mutation.mutateAsync(variabler()),
    }
}
