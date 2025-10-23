import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { FormValues } from '../components/SendSykmelding/SendSykmeldingForm'
import { mapToSendSykmeldingValues } from '../utils/toSendSykmeldingUtils'
import { fetchJsonMedRequestId } from '../utils/fetch'
import { Sykmelding } from '../types/sykmelding'

export type SendSykmeldingMutation = {
    readonly sendSykmelding: Sykmelding
}

export function useSendSykmelding(
    sykmeldingId: string,
    onCompleted: (values: FormValues) => void,
    onError: () => void,
) {
    const router = useRouter()

    const queryClient = useQueryClient()

    return useMutation<SendSykmeldingMutation, unknown, FormValues>({
        mutationFn: async (values) => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' + sykmeldingId + '/send',
                {
                    method: 'POST',
                    body: JSON.stringify(mapToSendSykmeldingValues(values)),
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['sykmeldinger-flex', sykmeldingId],
            })
            queryClient
                .invalidateQueries({
                    queryKey: ['sykmeldinger-flex'],
                })
                .catch()

            await router.push(`/sykmeldinger/${sykmeldingId}/kvittering`, undefined, { scroll: true })
            onCompleted(variables)
        },
        onError: () => {
            onError()
        },
    })
}
