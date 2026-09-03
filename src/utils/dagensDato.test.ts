import { afterEach, describe, expect, it, vi } from 'vitest'

import { dagensDato } from './dagensDato'
import { isMockBackend } from './environment'

vi.mock('./environment', () => ({ isMockBackend: vi.fn() }))

describe('dagensDato', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('bruker fast mockdato når mock-backend er aktiv', () => {
        vi.mocked(isMockBackend).mockReturnValue(true)

        expect(dagensDato().toISOString()).toBe('2026-02-01T11:00:00.000Z')
    })

    it('bruker systemklokken når mock-backend er deaktivert', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2030-06-15T08:00:00.000Z'))
        vi.mocked(isMockBackend).mockReturnValue(false)

        expect(dagensDato()).toEqual(new Date('2030-06-15T08:00:00.000Z'))
    })
})
