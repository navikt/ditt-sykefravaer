import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Arbeidsevne from './Arbeidsevne'

describe('Arbeidsevne', () => {
    it('Viser tiltak hvis de finnes', () => {
        render(
            <Arbeidsevne
                tiltakArbeidsplassen="tiltak på arbeidsplassen"
                tiltakNAV="tiltak nav"
                andreTiltak="andre tiltak"
                parentId="test"
            />,
        )
        expect(screen.getByText('tiltak på arbeidsplassen')).toBeInTheDocument()
        expect(screen.getByText('tiltak nav')).toBeInTheDocument()
        expect(screen.getByText('andre tiltak')).toBeInTheDocument()
    })

    it('Viser tiltakArbeidsplassen selv om andre tiltak er null', () => {
        render(<Arbeidsevne tiltakArbeidsplassen="tiltak på arbeidsplassen" parentId="test" />)
        expect(screen.getByText('tiltak på arbeidsplassen')).toBeInTheDocument()
    })

    it('Viser ikke tiltak hvis de ikke finnes', () => {
        render(<Arbeidsevne parentId="test" />)
        expect(screen.queryByText('tiltak på arbeidsplassen')).not.toBeInTheDocument()
        expect(screen.queryByText('tiltak nav')).not.toBeInTheDocument()
        expect(screen.queryByText('andre tiltak')).not.toBeInTheDocument()
    })
})
