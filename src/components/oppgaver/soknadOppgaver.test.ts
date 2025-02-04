import { expect, it } from 'vitest'

import { Soknad } from '../../types/soknad'

import { skapSoknadOppgaver } from './soknadOppgaver'

it('Returnerer ingen oppgaver når det ikke er noen søknader', () => {
    const oppgaver = skapSoknadOppgaver([], 'http://soknad')
    expect(oppgaver).toEqual([])
})

it('Returnerer en oppgave når det er en arbeidstakersøknad', () => {
    const soknader: Soknad[] = [
        {
            id: '123',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'ARBEIDSTAKERE',
            status: 'NY',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://soknad/soknader/123',
            tekst: 'Du har en ny søknad om sykepenger',
        },
    ])
})

it('Returnerer en oppgave når det er en friskmeldt til arbeidsformidling soknad', () => {
    const soknader: Soknad[] = [
        {
            id: '123',
            arbeidssituasjon: null,
            soknadstype: 'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
            status: 'NY',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://soknad/soknader/123',
            tekst: 'Du har en ny søknad om sykepenger',
        },
    ])
})

it('Returnerer flere oppgaver når det er mange forskjellige søknader', () => {
    const soknader: Soknad[] = [
        {
            id: '1',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'ARBEIDSTAKERE',
            status: 'NY',
            opprettetDato: null,
        },
        {
            id: '2',
            arbeidssituasjon: 'ARBEIDSLEDIG',
            soknadstype: 'ARBEIDSLEDIG',
            status: 'NY',
            opprettetDato: null,
        },
        {
            id: '3',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'ARBEIDSTAKERE',
            status: 'UTKAST_TIL_KORRIGERING',
            opprettetDato: null,
        },
        {
            id: '4',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'REISETILSKUDD',
            status: 'UTKAST_TIL_KORRIGERING',
            opprettetDato: null,
        },
        {
            id: '5',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'GRADERT_REISETILSKUDD',
            status: 'NY',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://soknad',
            tekst: 'Du har tre nye søknader om sykepenger',
        },
        {
            lenke: 'http://soknad/soknader/4',
            tekst: 'Du har en ny søknad om reisetilskudd',
        },
        {
            lenke: 'http://soknad/soknader/5',
            tekst: 'Du har en ny søknad om sykepenger med reisetilskudd',
        },
    ])
})

it('Returnerer en oppgave når det er søknad om reisetilskudd', () => {
    const soknader: Soknad[] = [
        {
            id: '123',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'REISETILSKUDD',
            status: 'UTKAST_TIL_KORRIGERING',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://soknad/soknader/123',
            tekst: 'Du har en ny søknad om reisetilskudd',
        },
    ])
})

it('Returnerer ingen oppgaver når det er en sendt arbeidstakersøknad', () => {
    const soknader: Soknad[] = [
        {
            id: '123',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'ARBEIDSTAKERE',
            status: 'SENDT',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([])
})

it('Returnerer en oppgave når det er en ny utenlandssøknad', () => {
    const soknader: Soknad[] = [
        {
            id: '123',
            arbeidssituasjon: 'ARBEIDSTAKER',
            soknadstype: 'OPPHOLD_UTLAND',
            status: 'NY',
            opprettetDato: null,
        },
    ]
    const oppgaver = skapSoknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://soknad/sykepengesoknad-utland',
            tekst: 'Du har en ny søknad om å beholde sykepengene for reise utenfor EU/EØS',
        },
    ])
})
