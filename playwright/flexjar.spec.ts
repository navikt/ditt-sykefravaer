import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'

test.describe('Flexjar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer')
    })

    test('Kan gi ja feedback', async ({ page, getCLS }) => {
        await expect(page.locator('text=Svar på søknader')).toBeVisible()
        const feedbackTittel = page.getByText('Hjelp oss med å gjøre denne siden bedre')
        const section = page.getByRole('region').filter({ has: feedbackTittel })

        await section.getByRole('button', { name: 'Ja' }).click()
        await expect(section.getByRole('button', { name: 'Ja' })).toHaveCSS('background-color', 'rgb(35, 38, 42)')
        await section.getByRole('textbox').fill('Dette er en test')
        await section.getByRole('button', { name: 'Send tilbakemelding' }).click()
        await page.getByText('Takk for tilbakemeldingen!').isVisible()

        await validerCLS(getCLS, 'feedback form submission')
    })

    test('Kan gi nei feedback', async ({ page, getCLS }) => {
        await expect(page.locator('text=Svar på søknader')).toBeVisible()
        const feedbackTittel = page.getByText('Hjelp oss med å gjøre denne siden bedre')
        const section = page.getByRole('region').filter({ has: feedbackTittel })

        await section.getByRole('button', { name: 'Nei' }).click()
        await expect(section.getByRole('button', { name: 'Nei' })).toHaveCSS('background-color', 'rgb(35, 38, 42)')
        await section.getByRole('textbox').fill('Dette er en test')
        await section.getByRole('button', { name: 'Send tilbakemelding' }).click()
        await page.getByText('Takk for tilbakemeldingen!').isVisible()

        await validerCLS(getCLS, 'negative feedback form')
    })
})
