import { test, expect } from './utils/fixtures'

test.describe('Homepage Performance', () => {
    const GOOD_CLS_THRESHOLD: number = 0.1

    test('burde ha en god CLS score på første last', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer')
        await page.waitForLoadState('domcontentloaded')

        page.setDefaultTimeout(10000)

        const cls: number | null = await getCLS()

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
