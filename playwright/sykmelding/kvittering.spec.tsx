import { test, expect } from '@playwright/test'

import { gotoScenario } from '../utils/user-actions'

test.describe('KvitteringPage', () => {
    test('should NOT show egenmeldingsdager info when status is bekreftet', async ({ page }) => {
        await gotoScenario('enSentEnBekreftet')(page)
        await page.goto('/syk/sykefravaer/sykmelding/current-sykmelding-id/kvittering')

        await expect(page.locator('text=Sykmeldingen ble sendt til NAV.')).toBeVisible()

        await expect(page.getByRole('heading', { name: 'Sykmeldingen gjelder' })).toBeVisible()

        await expect(
            page.getByRole('alert', {
                name: /Hvis du ønsker å endre egenmeldingsdager/,
            }),
        ).toHaveCount(0)
    })
})
