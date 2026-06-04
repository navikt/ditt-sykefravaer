import { gotoScenario } from '../utils/user-actions'
import { test, expect } from '../utils/fixtures'

test.describe('Sykmeldinger landingsside', () => {
    test('skal feile med feilmelding ved API-feil', async ({ page }) => {
        await gotoScenario('feilmelding')(page)

        await page.waitForSelector('text=Vi har problemer med baksystemene for øyeblikket.')

        await expect(page.locator('text=Vi har problemer med baksystemene for øyeblikket.')).toBeVisible()
    })

    test('skal ikke vise noen sykmeldinger', async ({ page }) => {
        await gotoScenario('ingenSykmeldinger')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
    })

    test('skal bare vise nye sykmeldinger', async ({ page }) => {
        await gotoScenario('allTypeSykmelding')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
        await expect(page.locator('text=Tidligere sykmeldinger')).toBeVisible()

        await expect(page.getByRole('link', { name: /Sendt til NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Sendt til arbeidsgiver/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avbrutt av deg/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avvist av NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Utgått/ })).toBeVisible()
    })

    test('skal vise bare nye sykmeldinger, sortert stigende etter dato', async ({ page }) => {
        await gotoScenario('nyeSykmeldinger')(page)

        const lenkepanelContainer = page.getByRole('region', { name: 'Nye sykmeldinger' })
        const sykmeldingerList = lenkepanelContainer.locator('a')

        await expect(sykmeldingerList).toHaveCount(3)
        await expect(sykmeldingerList.nth(0)).toHaveText(/Papirsykmelding/)
        await expect(sykmeldingerList.nth(1)).toHaveText(/Avvist av NAV/)
        await expect(sykmeldingerList.nth(2)).toHaveText(/Sykmelding/)
    })

    test('skal vise under behandling i egen seksjon', async ({ page }) => {
        await gotoScenario('harUnderBehandling')(page)

        const behandlingSection = page.getByRole('region', { name: 'Under behandling' })
        const sykmeldingerList = behandlingSection.locator('a')

        await expect(sykmeldingerList).toHaveCount(1)
        await expect(sykmeldingerList.nth(0)).toHaveText(/Sendt til arbeidsgiver/)
    })

    test('skal vise nye og tidligere sykmeldinger', async ({ page }) => {
        await gotoScenario('normal')(page)

        const newSection = page.getByRole('region', { name: 'Nye sykmeldinger' })
        const previousSection = page.getByRole('region', { name: 'Tidligere sykmeldinger' })

        await expect(newSection.locator('a')).toHaveCount(1)
        await expect(previousSection.locator('a')).toHaveCount(2)
    })

    test('skal vise APEN men eldre enn 12 måneder sykmelding i tidligere-seksjonen', async ({ page }) => {
        await gotoScenario('apenMenGammelSykmelding')(page)

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()

        const previousSection = page.getByRole('region', { name: 'Tidligere sykmeldinger' })
        await expect(previousSection.locator('a')).toHaveCount(1)
    })

    test('skal ikke kaste feil ved mottak av AVVIST sykmelding med ugyldig data', async ({ page }) => {
        await gotoScenario('avvistData')(page)

        const newSection = page.getByRole('region', { name: 'Nye sykmeldinger' })
        await expect(newSection.getByRole('link', { name: /Avvist av NAV/ })).toBeVisible()
    })
})
