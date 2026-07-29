import { expect } from '@playwright/test'
import { Locator } from 'playwright-core'

expect.extend({
    async toHaveDescriptiveText(locator: Locator, expectedText?: string) {
        const describedId = await locator.getAttribute('aria-describedby')
        if (describedId == null) {
            return {
                message: () => `Element is missing "aria-describedby"`,
                pass: false,
            }
        }

        const descriptiveLocator = locator.page().locator(`#${describedId}`)
        await expect(descriptiveLocator, { message: 'Descriptive text does not match' }).toHaveText(expectedText ?? '')

        return {
            message: () => 'passed',
            pass: true,
        }
    },
})
