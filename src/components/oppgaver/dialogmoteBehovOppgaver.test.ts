import { expect } from '@jest/globals'

import { DialogmoteBehov } from '../../types/dialogmoteBehov'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'

it('Returnerer ingen oppgaver når det ikke er dialogmøteBehov', () => {
    const oppgaver = skapDialogmoteBehovOppgaver(undefined, 'http://tjenester.nav.no/dialogmote')
    expect(oppgaver).toEqual([])
})

it('Returnerer ingen oppgave dersom motebehov for SVAR_BEHOV er utfylt', () => {
    const dialogmoteBehov: DialogmoteBehov = {
        visMotebehov: true,
        skjemaType: 'SVAR_BEHOV',
        motebehov: {
            id: '123',
        },
    }
    const oppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, 'http://tjenester.nav.no/dialogmote')
    expect(oppgaver).toEqual([])
})

it('Returnerer dialogmoteBehov oppgave når skjematype er SVAR_BEHOV', () => {
    const dialogmoteBehov: DialogmoteBehov = {
        visMotebehov: true,
        skjemaType: 'SVAR_BEHOV',
        motebehov: null,
    }
    const oppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, 'http://tjenester.nav.no/dialogmote/behov')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://tjenester.nav.no/dialogmote/behov',
            tekst: 'Du har en ny forespørsel om behov for dialogmøte',
        },
    ])
})
