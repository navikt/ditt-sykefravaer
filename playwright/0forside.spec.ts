import { test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer')
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:8080/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
    })
})
