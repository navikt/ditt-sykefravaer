import { describe, expect, it } from 'vitest'

import { localDevelopmentToggles } from './utils'

describe('Flexjar enabled-toggle i mock- og Playwright-oppsett', () => {
    it('er default enabled', () => {
        expect(localDevelopmentToggles()).toContainEqual(
            expect.objectContaining({ name: 'flexjar-ditt-sykefravaer-enabled', enabled: true }),
        )
    })

    it.each([
        ['true', true],
        ['false', false],
    ])('respekterer eksplisitt query-parameter %s', (verdi, enabled) => {
        const toggles = localDevelopmentToggles({ query: { 'toggle_flexjar-ditt-sykefravaer-enabled': verdi } })

        expect(toggles).toContainEqual(expect.objectContaining({ name: 'flexjar-ditt-sykefravaer-enabled', enabled }))
    })
})
