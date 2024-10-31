import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer')
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:3000/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
    })
})
