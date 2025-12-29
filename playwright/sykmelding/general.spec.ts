import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'
import { sporsmal } from '../../src/utils/sporsmal'
import { expect, test } from '../utils/fixtures'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

test.describe('sykmelding page tests that are not specific to a user', () => {
    test('should show details from sykmelding without a11y problems', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page.getByText(sporsmal.erOpplysningeneRiktige)).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()
    })

    test('burde vise korrekt dato uavhengig av tidssone', async ({ page, uuOptions }) => {
        uuOptions.skipUU = true

        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger/id-apen-sykmelding')
        const datePeriodElements = await page.getByText(`8. - 15. januar ${testAar}`).all()

        expect(datePeriodElements.length).toBeGreaterThan(0)

        for (const element of datePeriodElements) {
            await expect(element).toHaveText(`8. - 15. januar ${testAar}`)
        }
    })

    test('burde vise korrekt dato i UTC tidssone', async ({ browser, uuOptions }) => {
        uuOptions.skipUU = true

        const context = await browser.newContext({ timezoneId: 'UTC' })
        const page = await context.newPage()

        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger/id-apen-sykmelding')
        const datePeriodElements = await page.getByText(`8. - 15. januar ${testAar}`).all()

        expect(datePeriodElements.length).toBeGreaterThan(0)

        for (const element of datePeriodElements) {
            await expect(element).toHaveText(`8. - 15. januar ${testAar}`)
        }
    })

    test('burde vise korrekt dato i America/New_York tidssone', async ({ browser, uuOptions }) => {
        uuOptions.skipUU = true

        const context = await browser.newContext({ timezoneId: 'America/New_York' })
        const page = await context.newPage()

        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page).toHaveURL('/syk/sykefravaer/sykmeldinger/id-apen-sykmelding')
        const datePeriodElements = await page.getByText(`8. - 15. januar ${testAar}`).all()

        expect(datePeriodElements.length).toBeGreaterThan(0)

        for (const element of datePeriodElements) {
            await expect(element).toHaveText(`8. - 15. januar ${testAar}`)
        }
    })

    test('legacy: a user without any "bruker svar" should still be able to view kvittering', async ({ page }) => {
        await gotoScenario('noBrukerSvar')(page)
        await navigateToFirstSykmelding('tidligere', '100%')(page)

        await expect(page.getByText(/Sykmeldingen ble sendt til/)).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()
        await expect(page.getByRole('region', { name: 'Flere opplysninger' })).toBeVisible()
        await expect(page.getByRole('region', { name: 'Se hva som sendes til jobben din' })).toBeVisible()

        await expect(page.getByRole('region', { name: 'Dine svar' })).not.toBeVisible()
    })
})
