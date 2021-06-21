import constate from 'constate'
import { useState } from 'react'

import { ArbeidsrettetOppfolging } from '../../types/arbeidsrettetOppfolging'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { RSVedtakWrapper } from '../../types/rs-types/rs-vedtak'

export const [ AppStoreProvider, useAppStore ] = constate(() => {
    const [ rsVedtak, setRsVedtak ] = useState<RSVedtakWrapper[]>([])
    const [ arbeidsrettetOppfolging, setArbeidsrettetOppfolging ] = useState<ArbeidsrettetOppfolging | null>(null)
    const [ feilState, setFeilState ] = useState<boolean>(false)
    const [ snartSluttPaSykepengene, setSnartSluttPaSykepengene ] = useState<boolean>(false)
    const [ narmesteLedere, setNarmesteLedere ] = useState<NarmesteLeder[]>([])

    return {
        rsVedtak, setRsVedtak,
        feilState, setFeilState,
        snartSluttPaSykepengene, setSnartSluttPaSykepengene,
        arbeidsrettetOppfolging, setArbeidsrettetOppfolging,
        narmesteLedere, setNarmesteLedere,
    }
})
