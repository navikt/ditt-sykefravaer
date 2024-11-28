import { expect } from '@playwright/test'

import { test } from '../fixtures'

test.describe('Sykmelding kvittering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer/sykmelding')
        const tidligereSykmeldinger = page.getByText('Tidligere sykmeldinger')
        await expect(tidligereSykmeldinger).toBeVisible()
        await page.getByRole('region').filter({ has: tidligereSykmeldinger }).getByText('Sykmelding').last().click()
        await expect(page.getByText('Sykmeldingen er sendt')).toBeVisible()
        await page.goto(page.url() + '/kvittering')
    })

    test('Kan gi ja feedback', async ({ page }) => {
        const feedbackTittel = page.getByText('Hjelp oss med å gjøre denne siden bedre')
        const feedbackSection = page.getByRole('region').filter({ has: feedbackTittel })
        await feedbackSection.getByRole('button', { name: 'Ja' }).click()
        await expect(feedbackSection.getByRole('button', { name: 'Ja' })).toHaveCSS(
            'background-color',
            'rgb(35, 38, 42)',
        )
        await feedbackSection.getByRole('textbox').fill('Dette er en test')
        await feedbackSection.getByRole('button', { name: 'Send tilbakemelding' }).click()
        await page.getByText('Takk for tilbakemeldingen!').isVisible()
    })
})
