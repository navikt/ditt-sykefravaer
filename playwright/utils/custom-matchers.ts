/* eslint-disable no-console */
import { expect } from '@playwright/test'
import { Locator, Page } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'

expect.extend({
    async toHaveDescriptiveText(locator: Locator, expectedText?: string) {
        const describedId = await locator.getAttribute('aria-describedby')
        if (describedId == null) {
            return {
                message: () => `Element is missing "aria-describedby"`,
                pass: false,
            }
        }

        const descriptiveText = await locator.page().locator(`#${describedId}`).textContent()
        expect(descriptiveText, { message: 'Descriptive text does not match' }).toEqual(expectedText)

        return {
            message: () => 'passed',
            pass: true,
        }
    },
    async toHaveNoViolations(page: Page) {
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations, { message: 'Found axe violations' }).toEqual([])
        const violations = results.violations

        if (violations.length > 0) {
            console.log('==================\n')
            console.log(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected:`)
            console.log(`\nURL: ${page.url()}`)
            console.log(`URL: ${page.url()}`)

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
        return {
            message: () => 'passed',
            pass: true,
        }
    },
})
