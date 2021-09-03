import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'

it('Returnerer ingen oppgaver når det ikke er dialogmøteBehov', () => {
    const oppgaver = skapDialogmoteBehovOppgaver(undefined, 'http://tjenester.nav.no/dialogmote')
    expect(oppgaver).toEqual([])
})

it('Returnerer dialogmoteBehov oppgave når skjematype er SVAR_BEHOV', () => {
    const dialogmoteBehov: DialogmoteBehov = {
        visMotebehov: true,
        skjemaType: 'SVAR_BEHOV',
        harMotebehov: false
    }
    const oppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, 'http://tjenester.nav.no/dialogmote')
    expect(oppgaver).toEqual([ {
        lenke: 'http://tjenester.nav.no/dialogmote/behov',
        tekst: 'Du har en ny forespørsel om behov for dialogmøte',
        oppgavetype: 'info',
    } ])
})
