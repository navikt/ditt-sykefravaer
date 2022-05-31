import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const motebehovErUbesvart = (dialogmoteBehov: DialogmoteBehov) => {
    if (
        dialogmoteBehov.visMotebehov &&
        dialogmoteBehov.skjemaType === 'SVAR_BEHOV'
    ) {
        return !dialogmoteBehov.motebehov
    }
    return false
}

export const skapDialogmoteBehovOppgaver = (
    dialogmoteBehov: DialogmoteBehov | undefined,
    motebehovUrl: string
) => {
    if (!dialogmoteBehov || !motebehovErUbesvart(dialogmoteBehov)) return []
    const oppgaver: Oppgave[] = []
    oppgaver.push({
        tekst: tekst('oppgaver.dialogmote.nyttMotebehovVarsel'),
        lenke: motebehovUrl,
    })

    return oppgaver
}
