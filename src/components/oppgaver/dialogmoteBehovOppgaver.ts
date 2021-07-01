import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const motebehovErUbesvart = (dialogmoteBehov: DialogmoteBehov) => {
    if (dialogmoteBehov.visMotebehov && dialogmoteBehov.skjemaType === 'SVAR_BEHOV') {
        return !dialogmoteBehov.harMotebehov
    }
    return false
}

export const skapDialogmoteBehovOppgaver = (dialogmoteBehov: DialogmoteBehov | undefined, lenke: string) => {
    if (!dialogmoteBehov || !motebehovErUbesvart(dialogmoteBehov)) return []
    const oppgaver: Oppgave[] = []
    oppgaver.push({
        tekst: tekst('oppgaver.dialogmote.behov.entall'),
        oppgavetype: 'info',
        lenke
    })

    return oppgaver
}
