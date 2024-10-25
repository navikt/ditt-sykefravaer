// fixtures.ts
import { test as base, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

export const test = base.extend({})

test.afterEach(async ({ page }) => {
    // Wait for the network to be idle to ensure all elements are loaded
    await page.waitForLoadState('networkidle')

    // Run the Axe accessibility analysis
    const results = await new AxeBuilder({ page }).analyze()

    const { violations } = results

    if (violations.length > 0) {
        // Log the number of violations
        console.log(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected:`)

        // Log detailed information for each violation
        for (const violation of violations) {
            console.log(`\nViolation ID: ${violation.id}`)
            console.log(`Description: ${violation.description}`)
            console.log(`Impact: ${violation.impact}`)
            console.log(`Help: ${violation.help}`)
            console.log(`Help URL: ${violation.helpUrl}`)

            // List all elements that failed this violation
            console.log('Affected Nodes:')
            violation.nodes.forEach(({ target }) => {
                console.log(`  - ${target.join(' ')}`)
            })
        }

        // Fail the test with a custom error message
        expect(violations.length, 'Accessibility violations found').toBe(0)
    }
})
