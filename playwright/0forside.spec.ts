import { test, expect } from '@playwright/test'
// import { checkA11y } from 'axe-playwright';
const { AxeBuilder } = require('@axe-core/playwright')
const playwright = require('playwright')

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer')

        await page.waitForLoadState('networkidle') // axe misses some accessibility issues if we don't wait for networkidle
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations.length).toBe(0)
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:8080/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
    })
})
