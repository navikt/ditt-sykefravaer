import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { sjekkCLS } from './utils/cls-simple'

test.describe('Tester soknad oppgaver', () => {
    test('En vanlig søknad for arbeidstaker', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=kun-en-soknad')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om sykepenger')

        await sjekkCLS(page, 'single soknad alert')
    })

    test('To nye søknader', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=flere-soknader')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har to nye søknader om sykepenger')

        await sjekkCLS(page, 'multiple soknader alert')
    })

    test('Soknad om å beholde sykepengene for reise utenfor EU/EØS', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=ny-soknad-utland-eos')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om å beholde sykepengene for reise utenfor EU/EØS')
        const link = page.getByTestId('oppgaver').locator('.navds-alert >> a')
        const href = await link.getAttribute('href')
        expect(href).toContain('/syk/sykepengesoknad/sykepengesoknad-utland')

        await sjekkCLS(page, 'utland soknad alert')
    })
})
