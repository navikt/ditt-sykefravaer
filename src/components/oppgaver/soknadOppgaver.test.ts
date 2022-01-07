import { Soknad } from '../../types/soknad'
import { skapSøknadOppgaver } from './soknadOppgaver'


it('Returnerer ingen oppgaver når det ikke er noen søknader', () => {
    const oppgaver = skapSøknadOppgaver([], 'http://soknad')
    expect(oppgaver).toEqual([])
})


it('Returnerer en oppgave når det er en arbeidstakersøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'ARBEIDSTAKERE',
        status: 'NY'
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        lenke: 'http://soknad/soknader/123',
        tekst: 'Du har en ny søknad om sykepenger',
        oppgavetype: 'info',
    } ])
})

it('Returnerer flere oppgaver når det er mange forskjellige søknader', () => {
    const soknader: Soknad[] = [ {
        id: '1',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'ARBEIDSTAKERE',
        status: 'NY'
    }, {
        id: '2',
        arbeidssituasjon: 'ARBEIDSLEDIG',
        soknadstype: 'ARBEIDSLEDIG',
        status: 'NY'
    }, {
        id: '3',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'ARBEIDSTAKERE',
        status: 'UTKAST_TIL_KORRIGERING'
    }, {
        id: '4',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'REISETILSKUDD',
        status: 'UTKAST_TIL_KORRIGERING'
    }, {
        id: '5',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'GRADERT_REISETILSKUDD',
        status: 'NY'
    }
    ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        'lenke': 'http://soknad',
        'tekst': 'Du har tre nye søknader om sykepenger',
        oppgavetype: 'info',
    },
    {
        'lenke': 'http://soknad/soknader/4',
        'tekst': 'Du har en ny søknad om reisetilskudd',
        oppgavetype: 'info',
    },
    {
        'lenke': 'http://soknad/soknader/5',
        'tekst': 'Du har en ny søknad om sykepenger med reisetilskudd',
        oppgavetype: 'info',
    }
    ])
})

it('Returnerer en oppgave når det er søknad om reisetilskudd', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'REISETILSKUDD',
        status: 'UTKAST_TIL_KORRIGERING'
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        lenke: 'http://soknad/soknader/123',
        tekst: 'Du har en ny søknad om reisetilskudd',
        oppgavetype: 'info',
    } ])
})

it('Returnerer ingen oppgaver når det er en sendt arbeidstakersøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'ARBEIDSTAKERE',
        status: 'SENDT'
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([])
})

it('Returnerer ingen oppgaver når det er en ny utenlandssøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: 'ARBEIDSTAKER',
        soknadstype: 'ARBEIDSTAKERE',
        status: 'SENDT'
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([])
})
