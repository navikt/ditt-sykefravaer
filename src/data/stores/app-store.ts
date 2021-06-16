import constate from 'constate'
import { useState } from 'react'

import { RSVedtakWrapper } from '../../types/rs-types/rs-vedtak'
import { Soknad } from '../../types/soknad'
import { Sykmelding } from '../../types/sykmelding'

export const [ AppStoreProvider, useAppStore ] = constate(() => {
    const [ soknader, setSoknader ] = useState<Soknad[]>([])
    const [ sykmeldinger, setSykmeldinger ] = useState<Sykmelding[]>([])
    const [ rsVedtak, setRsVedtak ] = useState<RSVedtakWrapper[]>([])
    const [ feilState, setFeilState ] = useState<boolean>(false)
    const [ snartSluttPaSykepengene, setSnartSluttPaSykepengene ] = useState<boolean>(false)

    return {
        soknader, setSoknader,
        rsVedtak, setRsVedtak,
        feilState, setFeilState,
        sykmeldinger, setSykmeldinger,
        snartSluttPaSykepengene, setSnartSluttPaSykepengene
    }
})
