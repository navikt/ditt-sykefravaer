import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'
import { test, expect } from '../utils/fixtures'
import { harSynligOverskrift } from '../utils/test-utils'

test.describe('Feilhåndtering', () => {
    test('should display sykmelding and form when all requests are successful', async ({ page }) => {
        await gotoScenario('normal')(page)

        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()
        await expect(page.getByRole('button', { name: /^(Send|Bekreft) sykmelding/ })).toBeVisible()
    })

    test('should force user to send inn unsent sykmelding if there is an older one', async ({ page, browserName }) => {
        if (browserName == 'firefox') {
            test.skip() //TODO: Flaky i Firefox, skal ikke teste med Firefox etterhvert
        }
        await gotoScenario('usendtMedTidligereSent')(page)

        const newSection = page.getByRole('region', { name: /Nye sykmeldinger/i })
        const secondSykmelding = newSection.locator('a').nth(1)
        await secondSykmelding.click()

        const forceOverskrift = await harSynligOverskrift(page, 'Før du kan begynne', 2)
        const forceBoks = forceOverskrift.locator('..')

        await expect(forceBoks.getByText('Du har 1 sykmelding du må velge om du skal bruke')).toBeVisible()
        await expect(forceBoks.getByRole('button', { name: /Gå til sykmeldingen/i })).toBeVisible()
        await expect(forceBoks.getByRole('link')).toHaveAttribute('href', /sykefravaer\/sykmeldinger/)

        await forceBoks.getByRole('link').click()
        await expect(page).toHaveURL(/\/sykefravaer\/sykmeldinger\/[a-z0-9-]+/)
        await harSynligOverskrift(page, 'Sykmelding', 1)

        await expect(page.getByRole('button', { name: 'Bekreft sykmelding' })).not.toBeVisible()
    })

    test('should fail with error message when sykmelding can’t be fetched', async ({ page }) => {
        await gotoScenario('sykmeldingFeil')(page)

        await navigateToFirstSykmelding('nye', '100%')(page)

        await page.waitForSelector('text=Det har oppstått en feil')

        await expect(page.locator('text=Det har oppstått en feil')).toBeVisible()
    })

    test('should show sykmelding, but not form, when brukerinformasjon can’t be fetched', async ({ page }) => {
        await gotoScenario('brukerinformasjonFeil')(page)

        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()

        await page.waitForSelector('text=Vi klarte dessverre ikke å hente informasjonen')

        await expect(page.locator('text=Vi klarte dessverre ikke å hente informasjonen')).toBeVisible()
    })
})
