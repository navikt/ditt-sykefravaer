import { expect, type Page } from '@playwright/test'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'

function trackFeedbackMethods(page: Page): string[] {
    const feedbackMethods: string[] = []
    page.on('request', (request) => {
        if (request.url().includes('/flexjar-backend/api/v2/feedback')) {
            feedbackMethods.push(request.method())
        }
    })

    return feedbackMethods
}

test.describe('Flexjar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer')
    })

    test('Kan gi ja feedback', async ({ page, getCLS }) => {
        const feedbackMethods = trackFeedbackMethods(page)

        await expect(page.locator('text=Svar på søknader')).toBeVisible()
        const feedbackTittel = page.getByText('Hjelp oss med å gjøre denne siden bedre')
        const section = page.getByRole('region').filter({ has: feedbackTittel })

        await section.getByRole('button', { name: 'Ja' }).click()
        await expect(section.getByRole('button', { name: 'Ja' })).toHaveCSS('background-color', 'rgb(73, 81, 94)')
        await section.getByRole('textbox').fill('Dette er en test')
        await section.getByRole('button', { name: 'Send tilbakemelding' }).click()
        await expect(page.getByText('Takk for tilbakemeldingen!')).toBeVisible()
        expect(feedbackMethods).toEqual(['POST', 'PUT'])

        await validerCLS(getCLS, 'feedback form submission')
    })

    test('Kan gi nei feedback', async ({ page, getCLS }) => {
        const feedbackMethods = trackFeedbackMethods(page)

        await expect(page.locator('text=Svar på søknader')).toBeVisible()
        const feedbackTittel = page.getByText('Hjelp oss med å gjøre denne siden bedre')
        const section = page.getByRole('region').filter({ has: feedbackTittel })

        await section.getByRole('button', { name: 'Nei' }).click()
        await expect(section.getByRole('button', { name: 'Nei' })).toHaveCSS('background-color', 'rgb(73, 81, 94)')
        await section.getByRole('textbox').fill('Dette er en test')
        await section.getByRole('button', { name: 'Send tilbakemelding' }).click()
        await expect(page.getByText('Takk for tilbakemeldingen!')).toBeVisible()
        expect(feedbackMethods).toEqual(['POST', 'PUT'])

        await validerCLS(getCLS, 'negative feedback form')
    })
})
