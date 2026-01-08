import { expect } from '@playwright/test'

import { test } from '../utils/fixtures'

test.describe('Sykmelding kvittering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')
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

        await test.step('Payload inneholder arbeidssituasjon', async () => {
            const [request] = await Promise.all([
                page.waitForRequest((request) => request.url().includes('/flexjar-backend/api/v2/feedback')),
                feedbackSection.getByRole('button', { name: 'Send tilbakemelding' }).click(),
            ])
            const postData = JSON.parse(request.postData() || '{}')
            expect(postData).toHaveProperty('arbeidssituasjon', 'ARBEIDSTAKER')
        })

        await page.getByText('Takk for tilbakemeldingen!').isVisible()
    })
})
