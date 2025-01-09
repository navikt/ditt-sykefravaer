import { test, expect } from '@playwright/test'

import { gotoScenario } from '../utils/user-actions'

test.describe('Sykmeldinger landingsside', () => {
    test('should fail with error message on API error', async ({ page }) => {
        const [response] = await Promise.all([
            page.waitForResponse((res) => {
                return res.url().includes('/api/flex-sykmeldinger-backend/api/v1/sykmeldinger') && res.status() === 500
            }),
            gotoScenario('feilmelding')(page),
        ])

        expect(response.status()).toBe(500)
        await expect(page.locator('text=Vi har problemer med baksystemene for øyeblikket.')).toBeVisible()
    })

    test('should not display any sykmeldinger', async ({ page }) => {
        await gotoScenario('ingenSykmeldinger')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
    })

    test('should only display new sykmeldinger', async ({ page }) => {
        await gotoScenario('allTypeSykmelding')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
        await expect(page.locator('text=Tidligere sykmeldinger')).toBeVisible()

        await expect(page.getByRole('link', { name: /Sendt til NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Sendt til arbeidsgiver/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avbrutt av deg/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avvist av NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Utgått/ })).toBeVisible()
    })

    test('should display only new sykmeldinger, sorted by ascending date', async ({ page }) => {
        await gotoScenario('nyeSykmeldinger')(page)

        const lenkepanelContainer = page.getByRole('region', { name: 'Nye sykmeldinger' })
        const sykmeldingerList = lenkepanelContainer.locator('a')

        await expect(sykmeldingerList).toHaveCount(3)
        await expect(sykmeldingerList.nth(0)).toHaveText(/Papirsykmelding/)
        await expect(sykmeldingerList.nth(1)).toHaveText(/Avvist av NAV/)
        await expect(sykmeldingerList.nth(2)).toHaveText(/Sykmelding/)
    })

    test('should display under behandling in separate section', async ({ page }) => {
        await gotoScenario('harUnderBehandling')(page)

        const behandlingSection = page.getByRole('region', { name: 'Under behandling' })
        const sykmeldingerList = behandlingSection.locator('a')

        await expect(sykmeldingerList).toHaveCount(1)
        await expect(sykmeldingerList.nth(0)).toHaveText(/Sendt til arbeidsgiver/)
    })

    test('should display new and earlier sykmeldinger', async ({ page }) => {
        await gotoScenario('normal')(page)

        const newSection = page.getByRole('region', { name: 'Nye sykmeldinger' })
        const previousSection = page.getByRole('region', { name: 'Tidligere sykmeldinger' })

        await expect(newSection.locator('a')).toHaveCount(1)
        await expect(previousSection.locator('a')).toHaveCount(2)
    })

    test('should display APEN but older than 12 months sykmelding in tidligere section', async ({ page }) => {
        await gotoScenario('apenMenGammelSykmelding')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()

        const previousSection = page.getByRole('region', { name: 'Tidligere sykmeldinger' })
        await expect(previousSection.locator('a')).toHaveCount(1)
    })

    test('should not throw error when receiving a AVVIST sykmelding with invalid data', async ({ page }) => {
        await gotoScenario('avvistData')(page)

        const newSection = page.getByRole('region', { name: 'Nye sykmeldinger' })
        await expect(newSection.getByRole('link', { name: /Avvist av NAV/ })).toBeVisible()
    })
})
