import constate from 'constate'
import { useState } from 'react'

import { ArbeidsrettetOppfolging } from '../../types/arbeidsrettetOppfolging'
import { NarmesteLeder } from '../../types/narmesteLeder'
import { RSVedtakWrapper } from '../../types/rs-types/rs-vedtak'
import { Soknad } from '../../types/soknad'
import { Sykmelding } from '../../types/sykmelding'

export const [ AppStoreProvider, useAppStore ] = constate(() => {
    const [ soknader, setSoknader ] = useState<Soknad[]>([])
    const [ sykmeldinger, setSykmeldinger ] = useState<Sykmelding[]>([])
    const [ rsVedtak, setRsVedtak ] = useState<RSVedtakWrapper[]>([])
    const [ arbeidsrettetOppfolging, setArbeidsrettetOppfolging ] = useState<ArbeidsrettetOppfolging | null>(null)
    const [ feilState, setFeilState ] = useState<boolean>(false)
    const [ snartSluttPaSykepengene, setSnartSluttPaSykepengene ] = useState<boolean>(false)
    const [ narmesteLedere, setNarmesteLedere ] = useState<NarmesteLeder[]>([])

    return {
        soknader, setSoknader,
        rsVedtak, setRsVedtak,
        feilState, setFeilState,
        sykmeldinger, setSykmeldinger,
        snartSluttPaSykepengene, setSnartSluttPaSykepengene,
        arbeidsrettetOppfolging, setArbeidsrettetOppfolging,
        narmesteLedere, setNarmesteLedere,
    }
})
