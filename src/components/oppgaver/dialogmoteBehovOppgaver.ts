import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const motebehovErUbesvart = (dialogmoteBehov: DialogmoteBehov) => {
    if (dialogmoteBehov.visMotebehov && dialogmoteBehov.skjemaType === 'SVAR_BEHOV') {
        return !dialogmoteBehov.harMotebehov
    }
    return false
}

export const skapDialogmoteBehovOppgaver = (dialogmoteBehov: DialogmoteBehov | undefined, dialogmoteRoot: string) => {
    if (!dialogmoteBehov || !motebehovErUbesvart(dialogmoteBehov)) return []
    const oppgaver: Oppgave[] = []
    oppgaver.push({
        tekst: tekst('oppgaver.dialogmote.nyttMotebehovVarsel'),
        oppgavetype: 'info',
        lenke: `${dialogmoteRoot}/behov`
    })

    return oppgaver
}
