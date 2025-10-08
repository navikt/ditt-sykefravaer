import { test as base, expect } from '@playwright/test'

import { validerAxe } from './uuvalidering'

type UUOptions = {
    skipUU?: boolean
    disableRules?: string[]
}

export const test = base.extend<{
    uuOptions: UUOptions
}>({
    uuOptions: [{ skipUU: false, disableRules: [] }, { option: true }],
})

test.beforeEach(async ({ context, page }) => {
    // Reset cookies before each test
    await context.clearCookies()

    // Hide hints so they don't interfere
    await page.addInitScript(() => {
        window.localStorage.setItem('devtools-hint', 'false')
    })
})

test.afterEach(async ({ page, uuOptions }, testInfo) => {
    if (!uuOptions.skipUU) {
        await validerAxe(page, testInfo, uuOptions.disableRules)
    }
})

export { expect }
