import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'

test.describe('Tester soknad oppgaver', () => {
    test('En vanlig søknad for arbeidstaker', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer?testperson=kun-en-soknad')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om sykepenger')

        await validerCLS(getCLS, 'single soknad alert')
    })

    test('To nye søknader', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer?testperson=flere-soknader')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har to nye søknader om sykepenger')

        await validerCLS(getCLS, 'multiple soknader alert')
    })

    test('Soknad om å beholde sykepengene for reise utenfor EU/EØS', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer?testperson=ny-soknad-utland-eos')
        const alert = page.getByTestId('oppgaver').locator('.navds-alert')
        await expect(alert).toContainText('Du har en ny søknad om å beholde sykepengene for reise utenfor EU/EØS')
        const link = page.getByTestId('oppgaver').locator('.navds-alert >> a')
        const href = await link.getAttribute('href')
        expect(href).toContain('/syk/sykepengesoknad/sykepengesoknad-utland')

        await validerCLS(getCLS, 'utland soknad alert')
    })
})
