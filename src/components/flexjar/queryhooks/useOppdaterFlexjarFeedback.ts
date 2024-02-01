import { useMutation, useQueryClient } from '@tanstack/react-query'

import fetchMedRequestId from '../../../utils/fetch'
import { basePath } from '../../../utils/environment'

export function UseOppdaterFlexjarFeedback() {
    const queryClient = useQueryClient()

    return useMutation<unknown, Error, OppdaterFlexjarFeedbackRequest>({
        mutationKey: ['opprettFlexjarFeedback'],
        mutationFn: async (req) => {
            return fetchMedRequestId(`${basePath()}/api/flexjar-backend/api/v2/feedback/${req.id}`, {
                method: 'PUT',
                body: JSON.stringify(req.body),

                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },
        onSuccess: async (_, req) => {
            if (req.knappeklikk) {
                await queryClient.resetQueries(['opprettFlexjarFeedback'])
            }
        },
    })
}

interface OppdaterFlexjarFeedbackRequest {
    id: string
    body: object
    knappeklikk: boolean
}
