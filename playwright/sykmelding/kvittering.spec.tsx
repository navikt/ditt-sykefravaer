import { test, expect } from '@playwright/test'

import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'

test.describe('Kvittering', () => {
    test('should NOT show egenmeldingsdager info when status is bekreftet', async ({ page }) => {
        await gotoScenario('kvittering')(page)
        await navigateToFirstSykmelding('tidligere', '100%')(page)

        await expect(page.locator('text=Sykmeldingen ble sendt til NAV.')).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Sykmeldingen gjelder' })).toBeVisible()

        await expect(
            page.locator(
                'text=Hvis du ønsker å endre egenmeldingsdager etter at du har sendt sykmeldingen, må du ta kontakt med arbeidsgiver.',
            ),
        ).not.toBeVisible()
    })
})
