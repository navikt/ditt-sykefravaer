import { useQuery } from 'react-query'

import { DialogMote } from '../types/dialogmote'
import { syfoApiRoot } from '../utils/environment'
import Fetch from '../utils/fetch'

export default function UseDialogmoter() {
    return useQuery<DialogMote, Error>('dialogmoter', () =>
        Fetch.authenticatedGet(
            `${syfoApiRoot()}/syfomoteadmin/api/bruker/arbeidstaker/moter/siste`,
            async(data) => {
                return data as DialogMote
            },
        ),
    { retry: false }
    )
}

