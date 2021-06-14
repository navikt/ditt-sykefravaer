import { Sykmelding } from '../../types/sykmelding'
import { skapSykmeldingoppgaver } from './sykmelding-oppgaver'

it('Returnerer ingen oppgaver når det ikke er noen sykmeldinger', () => {
    const oppgaver = skapSykmeldingoppgaver([], 'http://sykmelding')
    expect(oppgaver).toEqual([])
})


it('Returnerer en oppgave når det er en åpen OK sykmelding', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'OK'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([ {
        lenke: 'http://sykmelding/123',
        tekst: 'Du har en ny sykmelding',
        oppgavetype: 'info',
    } ])
})

it('Returnerer en oppgave når det er en åpen manuell sykmelding', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'MANUAL_PROCESSING'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([ {
        lenke: 'http://sykmelding/123',
        tekst: 'Du har en ny sykmelding',
        oppgavetype: 'info',
    } ])
})


it('Returnerer en oppgave når det er en åpen manuell sykmelding og en åpen ok', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'MANUAL_PROCESSING'
        }
    }, {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'OK'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([ {
        lenke: 'http://sykmelding',
        tekst: 'Du har to nye sykmeldinger',
        oppgavetype: 'info',
    } ])
})


it('Returnerer ingen oppgaver når det er en sendt ok sykmelding', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'SENDT'
        },
        behandlingsutfall: {
            status: 'OK'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([])
})


it('Returnerer en oppgave når det er en åpen invalid sykmelding', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'INVALID'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([ {
        lenke: 'http://sykmelding/123',
        tekst: 'Du har en avvist sykmelding',
        oppgavetype: 'advarsel',
    } ])
})


it('Returnerer to oppgaver når det er en åpen invalid sykmelding og en åpen ok', () => {
    const sykmeldinger: Sykmelding[] = [ {
        id: '123',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'INVALID'
        }
    }, {
        id: '12345',
        sykmeldingStatus: {
            statusEvent: 'APEN'
        },
        behandlingsutfall: {
            status: 'OK'
        }
    } ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([ {
        lenke: 'http://sykmelding/12345',
        tekst: 'Du har en ny sykmelding',
        oppgavetype: 'info',
    } , {
        lenke: 'http://sykmelding/123',
        tekst: 'Du har en avvist sykmelding',
        oppgavetype: 'advarsel',
    } ])
})
