import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NarmesteLeder as Leder } from '../../types/narmesteLeder'

import NarmesteLeder from './NarmesteLeder'

const lederdata = vi.hoisted(() => ({
    ledere: [] as { id: string; navn: string; orgnummer: string; aktivFom: string }[],
}))
vi.mock('../../hooks/useNarmesteledere', () => ({
    default: () => ({ data: lederdata.ledere }),
}))
vi.mock('./BekreftFeilLeder', () => ({
    default: ({ open, narmesteLeder }: { open: boolean; narmesteLeder: Leder }) =>
        open ? (
            <div role="dialog" aria-label="Endre nærmeste leder">
                {narmesteLeder.navn}
            </div>
        ) : null,
}))

const forste: Leder = { id: 'a', navn: 'Leder A', orgnummer: '123', aktivFom: '2024-01-01' }
const andre: Leder = { ...forste, id: 'b', navn: 'Leder B' }

describe('NarmesteLeder', () => {
    it('lar ikke brukeren avkrefte en leder uten navn og lukker dialogen hvis navnet forsvinner', () => {
        lederdata.ledere = [forste]
        const visning = render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        fireEvent.click(screen.getByRole('button', { name: 'Meld fra om endring' }))
        expect(screen.getByRole('dialog')).toHaveTextContent('Leder A')

        for (const navn of ['', '   ']) {
            lederdata.ledere = [{ ...forste, navn }]
            visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
            expect(
                screen.getByText(/Navnet på den registrerte nærmeste lederen din er ikke tilgjengelig/),
            ).toBeVisible()
            expect(screen.queryByRole('button', { name: 'Meld fra om endring' })).not.toBeInTheDocument()
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        }

        lederdata.ledere = [forste]
        visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.getByRole('button', { name: 'Meld fra om endring' })).toBeVisible()
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('velger en leder med navn fremfor en leder med bare mellomrom i navnet', () => {
        lederdata.ledere = [{ ...forste, navn: '   ' }, andre]
        render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.getByText(/Leder B/)).toBeVisible()
        fireEvent.click(screen.getByRole('button', { name: 'Meld fra om endring' }))
        expect(screen.getByRole('dialog')).toHaveTextContent('Leder B')
    })

    it('nullstiller dialogen når valgt relasjon endres og når lederen kommer tilbake', () => {
        lederdata.ledere = [forste]
        const visning = render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        fireEvent.click(screen.getByRole('button', { name: 'Meld fra om endring' }))
        expect(screen.getByRole('dialog')).toHaveTextContent('Leder A')

        lederdata.ledere = [andre]
        visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Meld fra om endring' }))
        expect(screen.getByRole('dialog')).toHaveTextContent('Leder B')

        lederdata.ledere = []
        visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        lederdata.ledere = [forste]
        visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
})
