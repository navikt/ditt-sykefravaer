import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { skjulteE2eScenarioer, tekniskeScenarioer } from '../../data/mock/mock-db/scenarios'

import Person from './Person'

describe('Person - testdataverktøy for sykmelding', () => {
    it('viser de fire synlige scenariogruppene, men ingen tekniske eller E2E-scenarioer', async () => {
        render(<Person side="sykmelding" />)

        await userEvent.click(screen.getByRole('button', { name: 'Verktøy for testing' }))

        expect(screen.getByRole('heading', { name: 'Grunnleggende' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Periodetyper' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Status og unntak' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Historikk og kvittering' })).toBeInTheDocument()

        expect(screen.getByRole('link', { name: 'En ny og et par innsendte (standard)' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'En sykmelding med flere perioder' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Utgått sykmelding' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Info i kvittering' })).toBeInTheDocument()

        expect(screen.queryByText(tekniskeScenarioer.feilmelding.description)).not.toBeInTheDocument()
        expect(screen.queryByText(skjulteE2eScenarioer.noBrukerSvar.description)).not.toBeInTheDocument()
    })
})
