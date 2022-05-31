import { expect } from '@jest/globals'

import { Brev, BrevType } from '../../types/brev'
import { DialogMote, DialogmoteStatus } from '../../types/dialogmote'
import { skapDialogmoteSvarOppgaver } from './dialogmoteOppgaver'

const dialogmoteObject = (status: DialogmoteStatus): DialogMote => {
    return {
        bekreftetAlternativ: {
            id: 1,
            tid: '14:00',
            created: '01-01-2021',
            sted: 'et sted',
            valgt: true,
        },
        alternativer: [
            {
                id: 1,
                tid: '14:00',
                created: '01-01-2021',
                sted: 'et sted',
                valgt: true,
            },
        ],
        opprettetTidspunkt: '01-01-2021',
        bekreftetTidspunkt: '10-01-2021',
        deltakere: [
            {
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
                        valgt: false,
                    },
                ],
            },
        ],
        status: status,
    }
}

const brevObject = (brevType: BrevType, createdAt: string): Brev[] => {
    return [
        {
            uuid: 'mock-uuid',
            deltakerUuid: 'mock-deltaker-uuid',
            createdAt: createdAt,
            brevType: brevType,
            digitalt: true,
            lestDato: null,
            fritekst: 'Fri tekst',
            sted: 'Videomøte på Teams',
            tid: '2025-11-08T12:35:37.669+01:00',
            videoLink: 'https://teams.microsoft.com/l/osv.osv.osv',
            document: [],
            virksomhetsnummer: '1234',
        },
    ]
}

it('Returnerer ingen oppgaver når det ikke er dialogmøte', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(
        undefined,
        undefined,
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([])
})

it('Returnerer dialogmote oppgave når status er SKJEMA og brev var opprettet før møteplanlegger', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(
        dialogmoteObject('SKJEMA'),
        brevObject(BrevType.ENDRING, '2019-11-08T12:35:37.669+01:00'),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([
        {
            type: 'info',
            lenke: 'https://www.nav.no/syk/dialogmote',
            tekst: 'Svar på NAVs spørsmål om dialogmøte',
        },
    ])
})

it('Returnerer ikke dialogmote oppgave når status er SKJEMA og brev var opprettet etter møteplanlegger', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(
        dialogmoteObject('SKJEMA'),
        brevObject(BrevType.ENDRING, '2022-11-08T12:35:37.669+01:00'),
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([])
})

it('Returnerer ikke dialogmote oppgave når status ikke er SKJEMA', () => {
    const oppgaver = skapDialogmoteSvarOppgaver(
        dialogmoteObject('AVBRUTT'),
        undefined,
        'https://www.nav.no/syk/dialogmote'
    )
    expect(oppgaver).toEqual([])
})
