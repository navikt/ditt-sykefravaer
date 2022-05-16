import { expect } from '@jest/globals'

import { Brev, BrevType } from '../../types/brev'
import { skapBrevOppgaver } from './brevOppgaver'

const brevObject = (
    brevType: BrevType,
    createdAt: string,
    lestDato: string | null
): Brev[] => {
    return [
        {
            uuid: 'mock-uuid',
            deltakerUuid: 'mock-deltaker-uuid',
            createdAt: createdAt,
            brevType: brevType,
            digitalt: true,
            lestDato: lestDato,
            fritekst: 'Fri tekst',
            sted: 'Videomøte på Teams',
            tid: '2025-11-08T12:35:37.669+01:00',
            videoLink: 'https://teams.microsoft.com/l/osv.osv.osv',
            document: [],
            virksomhetsnummer: '1234',
        },
    ]
}

it('Returnerer ingen brev oppgaver når det ikke er brev', () => {
    const oppgaver = skapBrevOppgaver(
        undefined,
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([])
})

it("Returnerer endring brev advarsel oppgave når status er 'NYTT_TID_STED' og lestDato ikke er satt", () => {
    const oppgaver = skapBrevOppgaver(
        brevObject(BrevType.ENDRING, '2021-11-08T12:35:37.669+01:00', null),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([
        {
            lenke: 'https://www.nav.no/syk/dialogmote',
            tekst: 'Du har mottatt et brev om endret dialogmøte',
            oppgavetype: 'warning',
        },
    ])
})

it("Returnerer referat brev info oppgave når status er 'REFERAT' og lestDato ikke er satt", () => {
    const oppgaver = skapBrevOppgaver(
        brevObject(BrevType.REFERAT, '2021-11-08T12:35:37.669+01:00', null),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([
        {
            lenke: 'https://www.nav.no/syk/dialogmote',
            tekst: 'Du har mottatt et referat fra dialogmøte',
            oppgavetype: 'info',
        },
    ])
})

it("Returnerer referat brev info oppgave når status er 'REFERAT_ENDRET' og lestDato ikke er satt", () => {
    const oppgaver = skapBrevOppgaver(
        brevObject(
            BrevType.REFERAT_ENDRET,
            '2021-11-08T12:35:37.669+01:00',
            null
        ),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([
        {
            lenke: 'https://www.nav.no/syk/dialogmote',
            tekst: 'Du har mottatt et referat fra dialogmøte',
            oppgavetype: 'info',
        },
    ])
})

it("Returnerer ingen brev oppgaver når status er 'NYTT_TID_STED' og lestDato er satt", () => {
    const oppgaver = skapBrevOppgaver(
        brevObject(
            BrevType.ENDRING,
            '2021-11-08T12:35:37.669+01:00',
            '2021-11-01T12:35:37.669+01:00'
        ),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([])
})
