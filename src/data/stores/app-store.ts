import constate from 'constate'
import { useState } from 'react'

import { ArbeidsrettetOppfolging } from '../../types/arbeidsrettetOppfolging'
import { RSVedtakWrapper } from '../../types/rs-types/rs-vedtak'

export const [ AppStoreProvider, useAppStore ] = constate(() => {
    const [ rsVedtak, setRsVedtak ] = useState<RSVedtakWrapper[]>([])
    const [ arbeidsrettetOppfolging, setArbeidsrettetOppfolging ] = useState<ArbeidsrettetOppfolging | null>(null)

    return {
        rsVedtak, setRsVedtak,
        arbeidsrettetOppfolging, setArbeidsrettetOppfolging,
    }
})
