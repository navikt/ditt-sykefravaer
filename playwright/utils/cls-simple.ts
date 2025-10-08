import { Page, expect } from '@playwright/test'

import { measureCLSWithWebVitals } from './web-vitals-setup'

/**
 * Simple function to add CLS verification to any test
 * Just call this at the end of your test - no complex logic needed
 */
export async function sjekkCLS(page: Page, testNavn?: string): Promise<void> {
    const cls = await measureCLSWithWebVitals(page)

    if (cls === null) {
        // Soft fail if measurement failed - won't break the functional test
        expect.soft(false, `CLS measurement failed${testNavn ? ` in test: ${testNavn}` : ''}`).toBe(true)
        return
    }

    // Soft assertion - will be reported but won't fail the test
    expect.soft(cls, `CLS score too high${testNavn ? ` in ${testNavn}` : ''}: ${cls}`).toBeLessThanOrEqual(0.1)
}
