import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import BekreftFeilLeder from './BekreftFeilLeder'

const avkreft = vi.hoisted(() => vi.fn())
vi.mock('../../hooks/useAvkreftNarmesteLeder', () => ({
    default: () => ({ mutateAsync: avkreft, isPending: false, isSuccess: false, isError: false }),
}))

describe('BekreftFeilLeder', () => {
    it.each(['', '   '])('viser ikke dialogen når navnet mangler', (navn) => {
        render(
            <BekreftFeilLeder
                open
                toggle={vi.fn()}
                narmesteLeder={{ id: 'leder', navn, orgnummer: '123', aktivFom: '2024-01-01' }}
                orgNavn="Arbeidsgiver"
            />,
        )

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(avkreft).not.toHaveBeenCalled()
    })
})
