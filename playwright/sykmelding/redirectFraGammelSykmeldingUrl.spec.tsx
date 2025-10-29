import { expect, test } from '@playwright/test'

test.describe('Redirect fra gammel sykmelding url', () => {
    test('redirect fra sykmelding oversikt side', async ({ page }) => {
        await page.goto('/syk/sykmeldinger/')
        await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger')
    })

    test('redirect fra spesifikk sykmelding side', async ({ page }) => {
        await page.goto('/syk/sykmeldinger/id-apen-sykmelding')
        await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger/id-apen-sykmelding')
    })
})
