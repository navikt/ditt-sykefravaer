import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Tester at oppgaver vises for søknader', () => {
    test('En vanlig søknad for arbeidstaker', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=kun-en-soknad')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om sykepenger')
    })

    test('To nye søknader', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=flere-soknader')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har to nye søknader om sykepenger')
    })

    test('Soknad om å beholde sykepengene for reise utenfor EU/EØS', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=ny-soknad-utland-eos')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om å beholde sykepengene for reise utenfor EU/EØS')
        const link = page.getByTestId('oppgaver').locator('.navds-alert >> a')
        const href = await link.getAttribute('href')
        expect(href).toContain('/syk/sykepengesoknad/sykepengesoknad-utland')
    })
})
