import { Melding } from '../../types/melding'
import { Oppgave } from './oppgaveTyper'

export const skapMeldinger = (meldinger: Melding[] | undefined): Oppgave[] => {
    if (!meldinger) {
        return []
    }

    return meldinger.map((m) => {
        return {
            lenke: m.lenke,
            tekst: m.tekst,
            type: m.variant,
        } as Oppgave
    })
}
