import { test as base, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

export const test = base.extend({})

test.afterEach(async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()

    const { violations } = results

    if (violations.length > 0) {
        console.log(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected:`)
        console.log(`\nURL: ${page.url()}`)

        for (const violation of violations) {
            console.log(`\nViolation ID: ${violation.id}`)
            console.log(`Description: ${violation.description}`)
            console.log(`Impact: ${violation.impact}`)
            console.log(`Help: ${violation.help}`)
            console.log(`Help URL: ${violation.helpUrl}`)

            // Add a reference to the test line in your GitHub Actions log
            console.trace('Violation detected in:', violation.nodes[0]?.target?.join(' ') || 'Unknown node')

            console.log('Affected Nodes:')
            violation.nodes.forEach(({ target }) => {
                console.log(`  - ${target.join(' ')}`)
            })
        }

        expect(violations.length, 'Accessibility violations found').toBe(0)
    }
})
