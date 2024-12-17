import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useRef } from 'react'

import { ChangeSykmeldingStatusMutation, SendSykmeldingMutation, SykmeldingChangeStatus } from 'queries'

import { FormValues } from '../components/SendSykmelding/SendSykmeldingForm'
import { mapToSendSykmeldingValues } from '../utils/toSendSykmeldingUtils'
import { fetchJsonMedRequestId } from '../utils/fetch'

export function useChangeSykmeldingStatus(
    sykmeldingId: string,
    status: SykmeldingChangeStatus,
    onCompleted: () => void,
    onError: () => void,
) {
    const dedupeRef = useRef(false)

    return useMutation<ChangeSykmeldingStatusMutation, unknown, void>({
        mutationFn: async () => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' + sykmeldingId + '/change-status',
                {
                    method: 'POST',
                    body: JSON.stringify(status),
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        },

        onSuccess: () => {
            dedupeRef.current = false
            onCompleted()
            window.scrollTo(0, 0)
        },
        onError: () => {
            dedupeRef.current = false
            onError()
        },
    })
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

            await router.push(`/sykmelding/${sykmeldingId}/kvittering`, undefined, { scroll: true })
            onCompleted(variables)
        },
        onError: () => {
            onError()
        },
    })
}
