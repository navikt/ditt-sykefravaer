import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Behandlingsutfall, RegelStatus, StatusEvent, SykmeldingStatus } from '../../types/sykmelding/sykmelding'

import StatusBanner from './StatusBanner'

describe('StatusBanner', () => {
    it('Renders Sendt banner with arbeidsgiver', () => {
        const sykmeldingStatus: SykmeldingStatus = {
            statusEvent: StatusEvent.SENDT,
            timestamp: '2021-05-01',
            arbeidsgiver: {
                orgnummer: '123456',
                orgNavn: 'Politiet',
            },
        }
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.OK,
            ruleHits: [],
        }

        render(<StatusBanner sykmeldingStatus={sykmeldingStatus} behandlingsutfall={behandlingsutfall} />)
        expect(screen.getByText(/Sykmeldingen ble sendt til Politiet./)).toBeInTheDocument()
    })

    it('Renders Bekreftet banner', () => {
        const sykmeldingStatus: SykmeldingStatus = {
            statusEvent: StatusEvent.BEKREFTET,
            timestamp: '2021-05-01',
            arbeidsgiver: null,
        }
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.OK,
            ruleHits: [],
        }

        render(<StatusBanner sykmeldingStatus={sykmeldingStatus} behandlingsutfall={behandlingsutfall} />)
        expect(screen.getByText(/Sykmeldingen ble sendt til NAV./)).toBeInTheDocument()
    })

    it('Renders Bekreftet egenmelding banner', () => {
        const sykmeldingStatus: SykmeldingStatus = {
            statusEvent: StatusEvent.BEKREFTET,
            timestamp: '2021-05-01',
            arbeidsgiver: null,
        }
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.OK,
            ruleHits: [],
        }

        render(<StatusBanner sykmeldingStatus={sykmeldingStatus} behandlingsutfall={behandlingsutfall} egenmeldt />)
        expect(screen.getByText(/Egenmeldingen ble sendt til NAV./)).toBeInTheDocument()
    })

    it('Renders bekreftet avvist banner', () => {
        const sykmeldingStatus: SykmeldingStatus = {
            statusEvent: StatusEvent.BEKREFTET,
            timestamp: '2021-05-01',
            arbeidsgiver: null,
        }
        const behandlingsutfall: Behandlingsutfall = {
            status: RegelStatus.INVALID,
            ruleHits: [],
        }

        render(<StatusBanner sykmeldingStatus={sykmeldingStatus} behandlingsutfall={behandlingsutfall} />)
        expect(screen.getByText(/Du bekreftet at du har lest at sykmeldingen er avvist/)).toBeInTheDocument()
    })
})
