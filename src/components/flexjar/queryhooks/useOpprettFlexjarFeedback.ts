import { useMutation } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../../utils/fetch'
import { basePath } from '../../../utils/environment'

export function UseOpprettFlexjarFeedback() {
    return useMutation<OpprettFeedbackResponse, unknown, object>({
        mutationKey: ['opprettFlexjarFeedback'],
        mutationFn: async (body) => {
            return fetchJsonMedRequestId(`${basePath()}/api/flexjar-backend/api/v2/feedback`, {
                method: 'POST',
                body: JSON.stringify(body),

                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },
    })
}

export interface OpprettFeedbackResponse {
    id: string
}
