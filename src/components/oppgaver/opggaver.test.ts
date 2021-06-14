import { RSArbeidssituasjon } from '../../types/rs-types/rs-arbeidssituasjon'
import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import { RSSoknadstype } from '../../types/rs-types/rs-soknadstype'
import { Soknad } from '../../types/soknad'
import { skapSøknadOppgaver } from './oppgaver'

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
        tekst: 'Du har 1 ny søknad om sykepenger',
    } ])
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
        tekst: 'Du har 1 ny søknad om reisetilskudd',
    } ])
})
