import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { Sykmelding } from '../types/sykmelding'

export type ChangeSykmeldingStatusMutation = {
    readonly changeSykmeldingStatus: Sykmelding
}

export enum SykmeldingChangeStatus {
    AVBRYT = 'AVBRYT',
    BEKREFT_AVVIST = 'BEKREFT_AVVIST',
}

export function useChangeSykmeldingStatus(
    sykmeldingId: string,
    status: SykmeldingChangeStatus,
    onCompleted: () => void,
    onError: () => void,
) {
    const dedupeRef = useRef(false)
    const queryClient = useQueryClient()

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

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['sykmeldinger-flex', sykmeldingId],
            })
            queryClient
                .invalidateQueries({
                    queryKey: ['sykmeldinger-flex'],
                })
                .catch()

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
