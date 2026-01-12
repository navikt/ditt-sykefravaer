import { subDays } from 'date-fns'

import { toReadableDate } from '../../src/utils/dateUtils'
import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'
import { testDato } from '../../src/data/mock/mock-db/data-creators'
import { test, expect } from '../utils/fixtures'

test.describe('Bekreft avvist sykmelding som lest', () => {
    test('burde vise begrunnelse for avvist sykmelding', async ({ page }) => {
        await gotoScenario('avvist')(page)

        await page
            .getByRole('region', { name: /Nye sykmeldinger/i })
            .getByRole('link', { name: /100% sykmeldt/ })
            .click()

        await expect(page.getByText(/Du trenger en ny sykmelding/)).toBeVisible()
    })

    test.describe('tester sjekkbokser', () => {
        test.beforeEach(async ({ page }) => {
            // The axe check sometimes checks for contrast mid-animation, which fails
            await page.emulateMedia({ reducedMotion: 'reduce' })
        })

        test('burde vise feilmelding når man prøver å sende inn uten å huke av i sjekkboksen', async ({ page }) => {
            await gotoScenario('avvist')(page)

            await page
                .getByRole('region', { name: /Nye sykmeldinger/i })
                .getByRole('link', { name: /100% sykmeldt/ })
                .click()

            await expect(page.getByText(/Du trenger en ny sykmelding/)).toBeVisible()
            await page.getByRole('button', { name: 'Bekreft' }).click()

            await expect(
                page.getByRole('checkbox', {
                    name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist',
                }),
            ).toHaveDescriptiveText('Du må bekrefte at du har lest at sykmeldingen er avvist.')
        })

        test('skal fjerne feilmelding etter at man klikker på avkrysningsboksen', async ({ page }) => {
            await gotoScenario('avvist')(page)
            await gotoScenario('avvist')(page)

            await page
                .getByRole('region', { name: /Nye sykmeldinger/i })
                .getByRole('link', { name: /100% sykmeldt/ })
                .click()

            await page.getByRole('button', { name: 'Bekreft' }).click()
            await expect(
                page.getByRole('checkbox', { name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist' }),
            ).toBeVisible()

            await expect(
                page.getByRole('checkbox', {
                    name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist',
                }),
            ).toHaveDescriptiveText('Du må bekrefte at du har lest at sykmeldingen er avvist.')

            await page
                .getByRole('checkbox', {
                    name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist',
                })
                .click()

            await expect(
                page.getByRole('checkbox', {
                    name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist',
                }),
            ).not.toHaveDescriptiveText()
        })

        test('Burde vise bekreftelse etter innsending', async ({ page }) => {
            await gotoScenario('avvist')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)

            await page
                .getByRole('checkbox', {
                    name: 'Jeg bekrefter at jeg har lest at sykmeldingen er avvist',
                })
                .click()

            await page.getByRole('button', { name: 'Bekreft' }).click()

            await expect(
                page.getByText(
                    `Du bekreftet at du har lest at sykmeldingen er avvist den ${toReadableDate(subDays(testDato, 7))}`,
                ),
            ).toBeVisible()

            await expect(page.getByRole('link', { name: 'Tilbake til Ditt sykefravær' })).toBeVisible()
        })
    })
})
