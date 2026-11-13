import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const mocks = vi.hoisted(() => ({
    opprettFeedback: vi.fn<(body: object) => Promise<{ id: string }>>(),
    oppdaterFeedback: vi.fn<(req: { body: object; id: string }) => Promise<unknown>>(),
    resetFeedback: vi.fn(),
}))

vi.mock('../../hooks/useDittSykefravaerSykmeldinger', () => ({ default: () => ({ data: undefined }) }))
vi.mock('../../hooks/useMaxDate', () => ({ default: () => ({ data: undefined }) }))
vi.mock('../umami/umami', () => ({ logEvent: vi.fn() }))
vi.mock('./queryhooks/useOpprettFlexjarFeedback', async () => {
    const { useState } = await import('react')

    return {
        UseOpprettFlexjarFeedback: () => {
            const [data, setData] = useState<{ id: string } | undefined>()

            return {
                data,
                mutateAsync: async (body: object) => {
                    const response = await mocks.opprettFeedback(body)
                    setData(response)
                    return response
                },
                reset: () => {
                    mocks.resetFeedback()
                    setData(undefined)
                },
                isPending: false,
            }
        },
    }
})
vi.mock('./queryhooks/useOppdaterFlexjarFeedback', () => ({
    UseOppdaterFlexjarFeedback: () => ({ mutateAsync: mocks.oppdaterFeedback, isPending: false }),
}))

describe('Flexjar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.opprettFeedback.mockResolvedValue({ id: 'feedback-id' })
        mocks.oppdaterFeedback.mockResolvedValue(undefined)
    })

    it('nullstiller svar, tekst og tidligere feedbackdata når feedbackId endres', async () => {
        const { rerender } = render(<Flexjar feedbackId="første" />)

        fireEvent.click(screen.getByRole('button', { name: 'Nei' }))
        await waitFor(() => expect(mocks.opprettFeedback).toHaveBeenCalledTimes(1))
        await screen.findByRole('button', { name: 'Send tilbakemelding' })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Gammel tilbakemelding' } })

        rerender(<Flexjar feedbackId="andre" />)

        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Nei' })).toHaveAttribute('aria-pressed', 'false')

        fireEvent.click(screen.getByRole('button', { name: 'Ja' }))
        await waitFor(() => expect(mocks.opprettFeedback).toHaveBeenCalledTimes(2))
        await screen.findByRole('button', { name: 'Send tilbakemelding' })

        expect(screen.getByRole('textbox')).toHaveValue('')
        expect(mocks.oppdaterFeedback).not.toHaveBeenCalled()
        expect(mocks.opprettFeedback).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ feedbackId: 'andre', feedback: '', svar: 'JA' }),
        )
    })

    it('nullstiller valideringsfeil når feedbackId endres', async () => {
        const { rerender } = render(<Flexjar feedbackId="første" />)

        fireEvent.click(screen.getByRole('button', { name: 'Nei' }))
        await waitFor(() => expect(mocks.opprettFeedback).toHaveBeenCalledTimes(1))
        await screen.findByRole('button', { name: 'Send tilbakemelding' })
        fireEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(screen.getByText('Tilbakemeldingen kan ikke være tom. Legg til tekst i feltet.')).toBeInTheDocument()

        rerender(<Flexjar feedbackId="andre" />)

        expect(
            screen.queryByText('Tilbakemeldingen kan ikke være tom. Legg til tekst i feltet.'),
        ).not.toBeInTheDocument()
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('beholder takk-tilstanden når feedbackId endres', async () => {
        const { rerender } = render(<Flexjar feedbackId="første" />)

        fireEvent.click(screen.getByRole('button', { name: 'Ja' }))
        await waitFor(() => expect(mocks.opprettFeedback).toHaveBeenCalledTimes(1))
        await screen.findByRole('button', { name: 'Send tilbakemelding' })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Takk for hjelpen' } })
        fireEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(await screen.findByText('Takk for tilbakemeldingen!')).toBeInTheDocument()

        rerender(<Flexjar feedbackId="andre" />)

        expect(screen.getByText('Takk for tilbakemeldingen!')).toBeInTheDocument()
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
        expect(mocks.oppdaterFeedback).toHaveBeenCalledTimes(1)
    })
})
