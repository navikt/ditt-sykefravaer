import { test, expect } from '@playwright/test'

import { measureCLSWithWebVitals } from './utils/web-vitals-setup'

test.describe('Homepage Performance', () => {
    const GOOD_CLS_THRESHOLD: number = 0.1

    test('should have a good CLS score on initial load', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer')
        await page.waitForLoadState('domcontentloaded')

        page.setDefaultTimeout(10000)

        const cls: number | null = await measureCLSWithWebVitals(page)

        if (cls === null) {
            expect(cls, 'CLS measurement failed: returned null').not.toBeNull()
            return
        }

        expect(
            cls,
            `CLS score (${cls}) is too high on the homepage. Expected <= ${GOOD_CLS_THRESHOLD}.`,
        ).toBeLessThanOrEqual(GOOD_CLS_THRESHOLD)
    })
})
