import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { MeldingTilNav } from '../../../../types/sykmelding/sykmelding'

import MeldingTilNavView from './MeldingTilNav'

describe('MeldingTilNavView', () => {
    it('Viser ønsker bistand hvis bistandUmiddelbart er true', () => {
        const meldingTilNav: MeldingTilNav = {
            bistandUmiddelbart: true,
            beskrivBistand: null,
        }
        render(<MeldingTilNavView meldingTilNav={meldingTilNav} parentId="test" />)
        expect(screen.getByText('Melding til Nav')).toBeInTheDocument()
        expect(screen.getByText('Ønskes bistand fra Nav nå?')).toBeInTheDocument()
    })

    it('Viser ikke ønsker bistand hvis bistandUmiddelbart er false', () => {
        const meldingTilNav: MeldingTilNav = {
            bistandUmiddelbart: false,
            beskrivBistand: null,
        }
        render(<MeldingTilNavView meldingTilNav={meldingTilNav} parentId="test" />)
        expect(() => {
            expect(screen.getByText('Melding til Nav'))
        }).toThrow()
        expect(() => {
            screen.getByText('Ønskes bistand fra Nav nå?')
        }).toThrow()
    })

    it('Viser beskrivelse', () => {
        const meldingTilNav: MeldingTilNav = {
            bistandUmiddelbart: true,
            beskrivBistand: 'beskrivelse av bistanden',
        }
        render(<MeldingTilNavView meldingTilNav={meldingTilNav} parentId="test" />)
        expect(screen.getByText('Nærmere beskrivelse')).toBeInTheDocument()
        expect(screen.getByText('beskrivelse av bistanden')).toBeInTheDocument()
    })

    it('Viser ikke seksjon hvis objekt ikke eksisterer', () => {
        render(<MeldingTilNavView parentId="test" />)
        expect(screen.queryByText('Melding til Nav')).not.toBeInTheDocument()
        expect(screen.queryByText('Ønskes bistand fra Nav nå?')).not.toBeInTheDocument()
        expect(screen.queryByText('Nærmere beskrivelse')).not.toBeInTheDocument()
    })
})
