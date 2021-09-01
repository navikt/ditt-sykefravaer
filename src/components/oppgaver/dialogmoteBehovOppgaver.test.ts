import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'

it('Returnerer ingen oppgaver når det ikke er dialogmøteBehov', () => {
    const oppgaver = skapDialogmoteBehovOppgaver(undefined, 'http://dialogmotebehov')
    expect(oppgaver).toEqual([])
})

it('Returnerer dialogmoteBehov oppgave når skjematype er SVAR_BEHOV', () => {
    const dialogmoteBehov: DialogmoteBehov = {
        visMotebehov: true,
        skjemaType: 'SVAR_BEHOV',
        harMotebehov: false
    }
    const oppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, 'http://dialogmotebehov')
    expect(oppgaver).toEqual([ {
        lenke: 'http://dialogmotebehov',
        tekst: 'Du har et dialogmøte som venter på godkjenning av deg',
        oppgavetype: 'info',
    } ])
})
