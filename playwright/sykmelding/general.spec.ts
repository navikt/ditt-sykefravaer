import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'
import { sporsmal } from '../../src/utils/sporsmal'
import { expect, test } from '../utils/fixtures'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

test.describe('sykmelding page tests that are not specific to a user', () => {
    test('viser sykmelding uten a11y feil', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page.getByText(sporsmal.erOpplysningeneRiktige)).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()
    })

    const timezones = [undefined, 'UTC', 'America/New_York']
    for (const timezoneId of timezones) {
        test(`viser korrekt dato i ${timezoneId ?? 'default'} tidssone`, async ({ browser, uuOptions }) => {
            uuOptions.skipUU = true

            const context = await browser.newContext({ timezoneId })
            const page = await context.newPage()

            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)

            await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger/id-apen-sykmelding')

            const datePeriod = `8. - 15. januar ${testAar}`
            const datePeriodLocator = page.getByText(datePeriod)

            await expect(datePeriodLocator.first()).toBeVisible()
            const datePeriodElements = await datePeriodLocator.all()

            expect(datePeriodElements.length).toBeGreaterThan(0)

            for (const element of datePeriodElements) {
                await expect(element).toHaveText(datePeriod)
            }
        })
    }

    test('nruker uten "bruker svar" skal uansett kunne se kvittering', async ({ page }) => {
        await gotoScenario('noBrukerSvar')(page)
        await navigateToFirstSykmelding('tidligere', '100%')(page)

        await expect(page.getByText(/Sykmeldingen ble sendt til/)).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()
        await expect(page.getByRole('region', { name: 'Flere opplysninger' })).toBeVisible()
        await expect(page.getByRole('region', { name: 'Se hva som sendes til jobben din' })).toBeVisible()

        await expect(page.getByRole('region', { name: 'Dine svar' })).not.toBeVisible()
    })
})
