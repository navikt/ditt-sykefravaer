import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Behandlingsutfall, RegelStatus } from '../../types/sykmelding/sykmelding'

import AvvistVeileder from './AvvistVeileder'

describe('AvvistVeileder', () => {
    it('Renders custom message if the therapist is missing authorization', () => {
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.INVALID,
            ruleHits: [
                {
                    messageForSender: '',
                    messageForUser: '',
                    ruleName: 'BEHANDLER_MANGLER_AUTORISASJON_I_HPR',
                    ruleStatus: RegelStatus.INVALID,
                },
            ],
        }

        render(<AvvistVeileder behandlerNavn="Doktor Legesen" behandlingsutfall={behandlingsutfall} perioder={[]} />)

        expect(screen.getByText(/Den som har skrevet sykmeldingen, har ikke autorisasjon/)).toBeInTheDocument()
    })

    it('Renders custom message for people over 70', () => {
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.INVALID,
            ruleHits: [
                {
                    messageForSender: '',
                    messageForUser: '',
                    ruleName: 'PASIENT_ELDRE_ENN_70',
                    ruleStatus: RegelStatus.INVALID,
                },
            ],
        }
        render(<AvvistVeileder behandlerNavn="Doktor Legesen" behandlingsutfall={behandlingsutfall} perioder={[]} />)

        expect(screen.getByText('Sykmeldingen kan dessverre ikke brukes her')).toBeInTheDocument()
        expect(screen.getByText(/Du har ikke rett til sykepenger, fordi du er over 70 år/)).toBeInTheDocument()
    })

    it('Renders custom message if z diagnose', () => {
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.INVALID,
            ruleHits: [
                {
                    messageForSender: '',
                    messageForUser: '',
                    ruleName: 'ICPC_2_Z_DIAGNOSE',
                    ruleStatus: RegelStatus.INVALID,
                },
            ],
        }
        render(<AvvistVeileder behandlerNavn="Doktor Legesen" behandlingsutfall={behandlingsutfall} perioder={[]} />)

        expect(
            screen.getByText(/Legen har skrevet en diagnose i sykmeldingen som ikke gir deg rett til sykepenger./),
        ).toBeInTheDocument()
    })

    it('Renders normal message for other rulehits', () => {
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.INVALID,
            ruleHits: [
                {
                    messageForSender: '',
                    messageForUser: 'Dessverre avvist',
                    ruleName: 'SOMETHING_ELSE',
                    ruleStatus: RegelStatus.INVALID,
                },
            ],
        }
        render(<AvvistVeileder behandlerNavn="Doktor Legesen" behandlingsutfall={behandlingsutfall} perioder={[]} />)

        expect(screen.getByText('Sykmeldingen kan dessverre ikke brukes her')).toBeInTheDocument()
        expect(screen.getByText(/Du trenger en ny sykmelding/)).toBeInTheDocument()
    })
})
