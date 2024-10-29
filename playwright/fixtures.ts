import { test as base, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

export const test = base.extend({})

test.afterEach(async ({ page }) => {
    // Wait for the network to be idle to ensure all elements are loaded
    // await page.waitForLoadState('networkidle')
    // Wait for all animations to finish

    const results = await new AxeBuilder({ page }).analyze()

    const { violations } = results

    if (violations.length > 0) {
        console.log(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected:`)

        for (const violation of violations) {
            console.log(`\nViolation ID: ${violation.id}`)
            console.log(`Description: ${violation.description}`)
            console.log(`Impact: ${violation.impact}`)
            console.log(`Help: ${violation.help}`)
            console.log(`Help URL: ${violation.helpUrl}`)

            console.log('Affected Nodes:')
            violation.nodes.forEach(({ target }) => {
                console.log(`  - ${target.join(' ')}`)
            })
        }

        expect(violations.length, 'Accessibility violations found').toBe(0)
    }
})
