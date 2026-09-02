import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { skjulteE2eScenarioer, tekniskeScenarioer } from '../../data/mock/mock-db/scenarios'

import Person from './Person'

// Aksel sin Popover bruker floating-ui, som kaller `new ResizeObserver(...)`. Den globale mocken i
// vitest.setup.mts er en pilfunksjon og kan derfor ikke brukes som konstruktør.
vi.stubGlobal(
    'ResizeObserver',
    class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    },
)

describe('Person - testdataverktøy for sykmelding', () => {
    it('viser de fire synlige scenariogruppene, men ingen tekniske eller E2E-scenarioer', async () => {
        render(<Person side="sykmelding" />)

        await userEvent.click(screen.getByRole('button', { name: 'Verktøy for testing' }))

        expect(screen.getByRole('heading', { name: 'Grunnleggende' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Periodetyper' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Status og unntak' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Historikk og kvittering' })).toBeInTheDocument()

        expect(screen.getByRole('button', { name: 'En ny og et par innsendte (standard)' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'En sykmelding med flere perioder' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Utgått sykmelding' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Info i kvittering' })).toBeInTheDocument()

        expect(screen.queryByText(tekniskeScenarioer.feilmelding.description)).not.toBeInTheDocument()
        expect(screen.queryByText(skjulteE2eScenarioer.noBrukerSvar.description)).not.toBeInTheDocument()
    })
})
