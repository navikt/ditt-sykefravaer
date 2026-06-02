import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OptIn } from './OptIn'

const { useHarSoknadMock, useOptInMock } = vi.hoisted(() => ({
    useHarSoknadMock: vi.fn(),
    useOptInMock: vi.fn(),
}))

vi.mock('../../hooks/sykmelding/useHarSoknad', () => ({ default: useHarSoknadMock }))
vi.mock('../../hooks/sykmelding/useOptIn', () => ({ default: useOptInMock }))

describe('OptIn', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('viser søknadsfristen er gått ut når sykmeldingen er eldre enn 4 måneder', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-05-29T12:00:00.000Z'))

        useHarSoknadMock.mockReturnValue({
            data: { harSoknad: false },
            isLoading: false,
            isError: false,
        })
        useOptInMock.mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isError: false,
            isSuccess: false,
        })

        const optInFrist = new Date('2026-05-28T00:00:00.000Z')

        render(<OptIn sykmeldingId="123" enabled={true} optInFrist={optInFrist} />)

        expect(screen.getByText('Søknadsfristen er gått ut')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Jeg vil søke om sykepenger' })).not.toBeInTheDocument()
    })

    it('viser opt-in-knapp når sykmeldingen er innenfor fire måneder og én dag', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-05-29T12:00:00.000Z'))

        useHarSoknadMock.mockReturnValue({
            data: { harSoknad: false },
            isLoading: false,
            isError: false,
        })
        useOptInMock.mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isError: false,
            isSuccess: false,
        })

        const optInFrist = new Date('2026-05-30T00:00:00.000Z')

        render(<OptIn sykmeldingId="123" enabled={true} optInFrist={optInFrist} />)

        expect(screen.queryByText('Søknadsfristen er gått ut')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Jeg vil søke om sykepenger' })).toBeInTheDocument()
    })
})
