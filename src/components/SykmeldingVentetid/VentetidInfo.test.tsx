import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { VentetidInfo } from './VentetidInfo'

const { OptInMock } = vi.hoisted(() => ({
    OptInMock: ({ sykmeldingId }: { sykmeldingId: string }) => <div data-testid="opt-in">{sykmeldingId}</div>,
}))

vi.mock('./OptIn', () => ({ OptIn: OptInMock }))

describe('VentetidInfo', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('viser opt-in når sykmeldingen er innenfor fire måneder og én dag', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-05-29T12:00:00.000Z'))

        render(<VentetidInfo sykmeldingId="123" optInFrist={new Date('2026-05-30T00:00:00.000Z')} />)

        screen.getByTestId('opt-in')
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('viser informasjonsvarsel når fristen på fire måneder og én dag er passert', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-05-29T12:00:00.000Z'))

        render(<VentetidInfo sykmeldingId="123" optInFrist={new Date('2026-05-28T00:00:00.000Z')} />)

        expect(screen.getByText('Søknadsfristen er gått ut.')).toBeInTheDocument()
        expect(screen.queryByTestId('opt-in')).not.toBeInTheDocument()
    })
})
