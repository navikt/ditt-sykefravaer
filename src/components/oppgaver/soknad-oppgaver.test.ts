import { RSArbeidssituasjon } from '../../types/rs-types/rs-arbeidssituasjon'
import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import { RSSoknadstype } from '../../types/rs-types/rs-soknadstype'
import { Soknad } from '../../types/soknad'
import { skapSøknadOppgaver } from './soknad-oppgaver'

it('Returnerer ingen oppgaver når det ikke er noen søknader', () => {
    const oppgaver = skapSøknadOppgaver([], 'http://soknad')
    expect(oppgaver).toEqual([])
})


it('Returnerer en oppgave når det er en arbeidstakersøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.ARBEIDSTAKERE,
        status: RSSoknadstatus.NY
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        lenke: 'http://soknad/soknader/123',
        tekst: 'Du har en ny søknad om sykepenger',
        type: 'info',
    } ])
})

it('Returnerer flere oppgaver når det er mange forskjellige søknader', () => {
    const soknader: Soknad[] = [ {
        id: '1',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.ARBEIDSTAKERE,
        status: RSSoknadstatus.NY
    }, {
        id: '2',
        arbeidssituasjon: RSArbeidssituasjon.ARBEISLEDIG,
        soknadstype: RSSoknadstype.ARBEIDSLEDIG,
        status: RSSoknadstatus.NY
    }, {
        id: '3',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.ARBEIDSTAKERE,
        status: RSSoknadstatus.UTKAST_TIL_KORRIGERING
    }, {
        id: '4',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.REISETILSKUDD,
        status: RSSoknadstatus.UTKAST_TIL_KORRIGERING
    }
    ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        'lenke': 'http://soknad',
        'tekst': 'Du har tre nye søknader om sykepenger',
        type: 'info',
    },
    {
        'lenke': 'http://soknad/soknader/4',
        'tekst': 'Du har en ny søknad om reisetilskudd',
        type: 'info',
    }
    ])
})

it('Returnerer en oppgave når det er søknad om reisetilskudd', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.REISETILSKUDD,
        status: RSSoknadstatus.UTKAST_TIL_KORRIGERING
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([ {
        lenke: 'http://soknad/soknader/123',
        tekst: 'Du har en ny søknad om reisetilskudd',
        type: 'info',
    } ])
})

it('Returnerer ingen oppgaver når det er en sendt arbeidstakersøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.ARBEIDSTAKERE,
        status: RSSoknadstatus.SENDT
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([])
})

it('Returnerer ingen oppgaver når det er en ny utenlandssøknad', () => {
    const soknader: Soknad[] = [ {
        id: '123',
        arbeidssituasjon: RSArbeidssituasjon.ARBEIDSTAKER,
        soknadstype: RSSoknadstype.ARBEIDSTAKERE,
        status: RSSoknadstatus.SENDT
    } ]
    const oppgaver = skapSøknadOppgaver(soknader, 'http://soknad')
    expect(oppgaver).toEqual([])
})
