import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Tester helt frisk person', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=helt-frisk')
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL(/\/syk\/sykefravaer/)
        await expect(page.locator('text=Dialogmøter')).toBeVisible()
    })

    test('Har veildertekst om papirsykmelding', async ({ page }) => {
        await expect(page.locator('text=Du har ingen digital sykmelding.')).toBeVisible()
        await expect(
            page.locator('text=Har du fått sykmeldingen på papir, kan du vente noen dager, så vil du finne den her.'),
        ).toBeVisible()
        const link = page.locator('.navds-guide-panel__content > a')
        await expect(link).toHaveAttribute('href', 'https://www.nav.no/sykmeldt-hva-skjer#digital-sykmelding')
    })
})
