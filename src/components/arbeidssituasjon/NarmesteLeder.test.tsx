import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NarmesteLeder as Leder } from '../../types/narmesteLeder'
import { tekst } from '../../utils/tekster'

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
    it.each(['', '   '])('velger første leder og tilbyr ikke avkrefting når navnet mangler', (navn) => {
        lederdata.ledere = [{ ...forste, navn }, andre]
        render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.getByText(tekst('din-situasjon.ingen-nærmesteleder'))).toBeVisible()
        expect(screen.queryByRole('button', { name: 'Meld fra om endring' })).not.toBeInTheDocument()
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('lukker dialogen når valgt relasjon endres', () => {
        lederdata.ledere = [forste]
        const visning = render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        fireEvent.click(screen.getByRole('button', { name: 'Meld fra om endring' }))
        expect(screen.getByRole('dialog')).toHaveTextContent('Leder A')

        lederdata.ledere = [andre]
        visning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByText(/Leder B/)).toBeVisible()
    })
})
