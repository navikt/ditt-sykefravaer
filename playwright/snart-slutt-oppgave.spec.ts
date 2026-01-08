import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Tester snart slutt oppgave', () => {
    test('Har riktig lenke', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')
        await page.waitForTimeout(10)
        const validLink = page.locator('main').locator('a:has-text("Snart slutt på sykepengene")').last()

        await expect(validLink).toBeVisible()

        const oppgaver = page.getByTestId('oppgaver')
        await expect(oppgaver).toHaveCount(1)

        const firstOppgave = oppgaver.first()
        await expect(firstOppgave).toContainText('Snart slutt på sykepengene')

        const href = 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene'
        const linkExists = (await firstOppgave.locator(`a[href="${href}"]`).count()) > 0
        expect(linkExists).toBeTruthy()
    })
})
