import { test, expect } from '@playwright/test'

import { gotoScenario } from '../utils/user-actions'

test.describe('KvitteringPage', () => {
    test('should NOT show egenmeldingsdager info when status is bekreftet', async ({ page }) => {
        await gotoScenario('enSentEnBekreftet')(page)
        await page.goto('/syk/sykefravaer/sykmelding/current-sykmelding-id/kvittering')

        // 3. Vent eksplisitt på at siden har lastet ferdig data
        //    (Hvis du har en spinner/skjelett, kan du vente på at den forsvinner)
        //    Du kan også vente på en spesiell tekst:
        await expect(page.locator('text=Sykmeldingen ble sendt til NAV.')).toBeVisible()

        // 4. Sjekk at overskrift "Sykmeldingen gjelder" er synlig
        await expect(page.getByRole('heading', { name: 'Sykmeldingen gjelder' })).toBeVisible()

        // 5. Sjekk at varsel om "endring av egenmeldingsdager" IKKE finnes
        //    (i Vitest var det .not.toBeInTheDocument())
        await expect(
            page.getByRole('alert', {
                name: /Hvis du ønsker å endre egenmeldingsdager/,
            }),
        ).toHaveCount(0) // => 0 elementer
    })
})
