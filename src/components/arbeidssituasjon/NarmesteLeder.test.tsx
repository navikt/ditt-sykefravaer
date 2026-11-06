import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NarmesteLeder as Leder } from '../../types/narmesteLeder'

import NarmesteLeder from './NarmesteLeder'

const lederdata = vi.hoisted(() => ({
    ledere: [] as { id: string; navn: string; orgnummer: string; aktivFom: string }[],
    avkreftede: [] as { orgnummer: string }[],
}))
vi.mock('../../hooks/useNarmesteledere', () => ({
    default: () => ({ data: lederdata.ledere }),
    useAvkreftedeLedere: () => lederdata.avkreftede,
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
    it('nullstiller dialogen når valgt relasjon endres og når lederen kommer tilbake', () => {
        lederdata.ledere = [forste]
        lederdata.avkreftede = []
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

    it('viser ventemelding kun hos arbeidsgiveren avkreftingen gjelder', () => {
        lederdata.ledere = []
        lederdata.avkreftede = [{ orgnummer: '123' }]
        const forsteVisning = render(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        const andreVisning = render(<NarmesteLeder orgnummer="456" orgNavn="Annen arbeidsgiver" />)
        expect(
            within(forsteVisning.container).getByText(/kan ikke bekrefte at endringen er fullført ennå/),
        ).toBeVisible()
        expect(within(forsteVisning.container).getByRole('status')).toHaveTextContent(/kan ikke bekrefte/)
        expect(within(andreVisning.container).queryByText(/kan ikke bekrefte/)).not.toBeInTheDocument()
        expect(within(andreVisning.container).getByText(/har ikke meldt inn/)).toBeVisible()

        lederdata.avkreftede = []
        forsteVisning.rerender(<NarmesteLeder orgnummer="123" orgNavn="Arbeidsgiver" />)
        expect(within(forsteVisning.container).queryByText(/kan ikke bekrefte/)).not.toBeInTheDocument()
        expect(within(forsteVisning.container).getByText(/har ikke meldt inn/)).toBeVisible()
    })
})
