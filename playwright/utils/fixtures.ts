import { test as base, expect } from '@playwright/test'

import { measureCLSWithWebVitals, getCLSValue } from './web-vitals-setup'
import { validerAxe } from './uuvalidering'

type UUOptions = {
    skipUU?: boolean
    disableRules?: string[]
}

type CLSOptions = {
    enableCLS?: boolean
}

export const test = base.extend<{
    uuOptions: UUOptions
    clsOptions: CLSOptions
    getCLS: () => Promise<number | null>
}>({
    uuOptions: [{ skipUU: false, disableRules: [] }, { option: true }],
    clsOptions: [{ enableCLS: true }, { option: true }],

    getCLS: async ({ page, clsOptions }, use) => {
        if (clsOptions.enableCLS) {
            await measureCLSWithWebVitals(page)
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        await use(async () => {
            if (!clsOptions.enableCLS) {
                return null
            }
            return await getCLSValue(page)
        })
    },
})

test.beforeEach(async ({ context, page }) => {
    // Reset cookies før hver test
    await context.clearCookies()

    // Skjul hint så de ikke er i veien for visuelle tester
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
