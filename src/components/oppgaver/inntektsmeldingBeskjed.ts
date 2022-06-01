import dayjs from 'dayjs'

import { isMockBackend } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const skapInntektsmeldingOppgave = (lenke: string): Oppgave[] => {
    const oppgaver: Oppgave[] = []
    // TODO: logikk for visning av inntektsmeldingoppgave
    // TODO: innhenting av arbeidsgiver og startdato for sykefravær

    if (isMockBackend()) {
        oppgaver.push({
            type: 'info',
            tekst: tekst('oppgaver.inntektsmelding.mangler', {
                '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                '%STARTDATO%': dayjs(new Date()).format('D. MMMM YYYY'),
            }),
            lenke,
        })
        oppgaver.push({
            type: 'success',
            tekst: tekst('oppgaver.inntektsmelding', {
                '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                '%STARTDATO%': dayjs(new Date()).format('D. MMMM YYYY'),
            }),
            lenke: '#',
        })
    }

    return oppgaver
}
