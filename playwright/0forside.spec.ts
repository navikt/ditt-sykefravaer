import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer')
        await injectAxe(page)
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:8080/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger dennetestenfinnesikke')).toBeVisible()
        await checkA11y(page)
    })
})
