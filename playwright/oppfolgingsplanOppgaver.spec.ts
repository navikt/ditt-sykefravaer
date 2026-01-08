import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Tester oppfølgingsplan oppgaver', () => {
    test('En ny oppgave', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=en-ny-oppfolgingsplan')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText(
            'Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.',
        )
    })

    test('To nye oppgaver', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText(
            'Arbeidsgiverne dine har begynt på hver sin oppfølgingsplan. Du skal fylle ut din del.',
        )
    })

    test('En til godkjenning', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=en-ny-oppfolgingsplan-til-godkjenning')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en oppfølgingsplan som venter på godkjenning av deg')
    })

    test('To til godkjenning', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner-til-godkjenning')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har to oppfølgingsplaner som venter på godkjenning av deg')
    })
})
