import { useMutation } from '@tanstack/react-query'

import { fetchMedRequestId } from '../utils/fetch'

export default function UseFlexjarFeedback() {
    return useMutation<unknown, Error, object>((body: object) =>
        fetchMedRequestId(`/syk/sykefravaer/api/flexjar-backend/api/v1/feedback`, {
            method: 'POST',
            body: JSON.stringify(body),

            headers: {
                'Content-Type': 'application/json',
            },
        }),
    )
}
