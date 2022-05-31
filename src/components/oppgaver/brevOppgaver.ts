import { Brev, BrevType } from '../../types/brev'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

export const skapBrevOppgaver = (
    brev: Brev[] | undefined,
    lenke: string
): Oppgave[] => {
    const oppgaver: Oppgave[] = []
    if (!brev) return []
    const nyesteUlestBrev = !brev[0]?.lestDato ? brev[0] : null
    switch (nyesteUlestBrev?.brevType) {
        case BrevType.INNKALT: {
            oppgaver.push({
                type: 'info',
                tekst: tekst('oppgaver.brev.innkalling'),
                lenke: lenke,
            })
            return oppgaver
        }
        case BrevType.ENDRING: {
            oppgaver.push({
                type: 'info',
                tekst: tekst('oppgaver.brev.endring'),
                lenke: lenke,
            })
            return oppgaver
        }
        case BrevType.REFERAT:
        case BrevType.REFERAT_ENDRET: {
            oppgaver.push({
                type: 'info',
                tekst: tekst('oppgaver.brev.referat'),
                lenke: lenke,
            })
            return oppgaver
        }
        case BrevType.AVLYST: {
            oppgaver.push({
                type: 'info',
                tekst: tekst('oppgaver.brev.avlysning'),
                lenke: lenke,
            })
            return oppgaver
        }
        default: {
            return oppgaver
        }
    }
}
