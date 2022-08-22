import dayjs from 'dayjs'

import { Melding } from '../../types/melding'
import { Oppgave } from './oppgaveTyper'

export const skapMeldinger = (meldinger: Melding[] | undefined): Oppgave[] => {
    if (!meldinger) {
        return []
    }

    return meldinger.map((m): Oppgave => {
        return {
            lenke: m.lenke,
            tekst: m.tekst,
            type: m.variant,
            lukkbar: m.lukkbar,
            meldingType: m.meldingType,
            id: m.uuid,
            opprettet: dayjs(m.opprettet),
        }
    })
}
