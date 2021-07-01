import { DialogMote, DialogmoteStatus } from '../../types/dialogmote'
import { skapDialogmoteSvarOppgaver } from './dialogmoteOppgaver'

const dialogmoteObject = (status: DialogmoteStatus): DialogMote => {
    return {
        bekreftetAlternativ: {
            id: 1,
            tid: '14:00',
            created: '01-01-2021',
            sted: 'et sted',
            valgt: true
        },
        alternativer: [ {
            id: 1,
            tid: '14:00',
            created: '01-01-2021',
            sted: 'et sted',
            valgt: true
        } ],
        opprettetTidspunkt: '01-01-2021',
        bekreftetTidspunkt: '10-01-2021',
        deltakere: [ {
            navn: 'Sykmeldt Sykmeldingsen',
            fnr: '98075738475',
            orgnummer: '99886654',
            epost: 'sykmeldt.sykmeldingsen@hotmail.com',
            type: 'Bruker',
            svartidspunkt: '',
            svar: [
                {
                    id: 1,
                    tid: '',
                    created: '',
                    sted: '',
                    valgt: false
                }
            ]
        } ],
        status: status

    }
}

it('Returnerer ingen oppgaver når det ikke er dialogmøte', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(undefined, 'http://dialogmote')
    expect(oppgaver).toEqual([])
})

it('Returnerer dialogmote oppgave når status er SKJEMA', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(dialogmoteObject('SKJEMA'), 'http://dialogmote')
    expect(oppgaver).toEqual([ {
        lenke: 'http://dialogmote',
        tekst: 'Svar på NAVs spørsmål om dialogmøte',
        oppgavetype: 'info',
    } ])
})

it('Returnerer ikke dialogmote oppgave når status ikke er SKJEMA', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(dialogmoteObject('AVBRUTT'), 'http://dialogmote')
    expect(oppgaver).toEqual([])
})
