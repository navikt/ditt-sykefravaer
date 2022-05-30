import { isMockBackend } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const skapInntektsmeldingOppgave = (lenke: string): Oppgave[] => {
    const oppgaver: Oppgave[] = []
    //TODO: logikk for visning av inntektsmeldingoppgave
    if (isMockBackend()) {
        oppgaver.push({
            tekst: tekst('oppgaver.inntektsmelding', {
                '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
            }),
            lenke,
        })
    }
    return oppgaver
}
