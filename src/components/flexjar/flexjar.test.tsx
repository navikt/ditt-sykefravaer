import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Flexjar } from './flexjar'

// Aksel TextareaAutoSize bruker `new ResizeObserver(...)`. Den globale mocken i
// vitest.setup.mts er en pilfunksjon og kan derfor ikke brukes som konstruktør.
vi.stubGlobal(
    'ResizeObserver',
    class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    },
)

vi.mock('../../hooks/useDittSykefravaerSykmeldinger', () => ({ default: () => ({ data: undefined }) }))
vi.mock('../../hooks/useMaxDate', () => ({ default: () => ({ data: undefined }) }))
vi.mock('../umami/umami', () => ({ logEvent: vi.fn() }))

// Tilbakemeldingen er allerede opprettet. POST/PUT-flyten testes i Playwright.
vi.mock('./queryhooks/useOpprettFlexjarFeedback', () => ({
    UseOpprettFlexjarFeedback: () => ({
        data: { id: 'feedback-id' },
        mutateAsync: vi.fn().mockResolvedValue({ id: 'feedback-id' }),
        reset: vi.fn(),
        isPending: false,
    }),
}))
vi.mock('./queryhooks/useOppdaterFlexjarFeedback', () => ({
    UseOppdaterFlexjarFeedback: () => ({ mutateAsync: vi.fn().mockResolvedValue(undefined), isPending: false }),
}))

describe('Flexjar', () => {
    it('fjerner valideringsfeilen når et annet svar velges', () => {
        render(<Flexjar feedbackId="ditt-sykefravaer-fant-du" />)
        const feilmeldingTomTekst = 'Tilbakemeldingen kan ikke være tom. Legg til tekst i feltet.'

        fireEvent.click(screen.getByRole('button', { name: 'Nei' }))
        fireEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))
        expect(screen.getByText(feilmeldingTomTekst)).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Ja' }))

        expect(screen.queryByText(feilmeldingTomTekst)).not.toBeInTheDocument()
        expect(screen.getByRole('textbox')).toHaveValue('')
    })
})
