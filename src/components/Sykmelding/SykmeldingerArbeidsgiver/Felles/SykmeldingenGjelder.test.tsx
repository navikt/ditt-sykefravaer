import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Pasient } from '../../../../types/sykmelding/sykmelding'

import SykmeldingenGjelder from './SykmeldingenGjelder'

describe('SykmeldingenGjelderView', () => {
    it('Viser ikke hvis navn er undefined', () => {
        const pasient: Pasient = {
            fnr: '12345678901',
            fornavn: null,
            mellomnavn: null,
            etternavn: null,
            overSyttiAar: null,
        }
        render(<SykmeldingenGjelder pasient={pasient} parentId="test" />)
        expect(screen.queryByText('Sykmeldingen gjelder')).not.toBeInTheDocument()
        expect(screen.queryByText('Ola Nordmann')).not.toBeInTheDocument()
        expect(screen.queryByText('12345678901')).not.toBeInTheDocument()
    })

    it('Viser navn og fnr hvis arbeidsgiver', () => {
        const pasient: Pasient = {
            fnr: '12345678901',
            fornavn: 'Ola',
            mellomnavn: null,
            etternavn: 'Nordmann',
            overSyttiAar: null,
        }
        render(<SykmeldingenGjelder pasient={pasient} parentId="test" />)
        expect(screen.getByText('Sykmeldingen gjelder')).toBeInTheDocument()
        expect(screen.getByText('Ola Nordmann')).toBeInTheDocument()
        expect(screen.getByText('Fødselsnummer: 123456 78901')).toBeInTheDocument()
    })
})
