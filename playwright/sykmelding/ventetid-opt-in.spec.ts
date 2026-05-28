import { expect } from '@playwright/test'

import { gotoScenario } from '../utils/user-actions'
import { test } from '../utils/fixtures'

const VENTETID_HEADING = 'Hva skjer videre?'
const OPT_IN_READ_MORE = 'Om din rett til å søke om sykepenger'

test.describe('Opt-in info vises kun for sykmeldinger innenfor ventetiden', () => {
    test.describe('Innsendt sykmelding (BEKREFTET frilanser)', () => {
        test('viser opt-in info når sykmelding er innenfor ventetiden', async ({ page }) => {
            await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: false })(page)

            await page.getByRole('region', { name: /Tidligere sykmeldinger/i }).getByRole('link').first().click()

            await expect(page.getByRole('heading', { name: VENTETID_HEADING })).toBeVisible()
            await expect(page.getByText(OPT_IN_READ_MORE)).toBeVisible()
        })

        test('skjuler opt-in info når sykmelding er utenfor ventetiden', async ({ page }) => {
            await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: true })(page)

            await page.getByRole('region', { name: /Tidligere sykmeldinger/i }).getByRole('link').first().click()

            await expect(page.getByRole('heading', { name: VENTETID_HEADING })).not.toBeVisible()
            await expect(page.getByText(OPT_IN_READ_MORE)).not.toBeVisible()
        })
    })

    test.describe('Kvittering (frilanser)', () => {
        test('viser opt-in info på kvittering når sykmelding er innenfor ventetiden', async ({ page }) => {
            await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: false })(page)

            await page.getByRole('region', { name: /Tidligere sykmeldinger/i }).getByRole('link').first().click()
            await page.goto(page.url() + '/kvittering')

            await expect(page.getByRole('heading', { name: VENTETID_HEADING })).toBeVisible()
            await expect(page.getByText(OPT_IN_READ_MORE)).toBeVisible()
        })

        test('skjuler opt-in info på kvittering når sykmelding er utenfor ventetiden', async ({ page }) => {
            await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: true })(page)

            await page.getByRole('region', { name: /Tidligere sykmeldinger/i }).getByRole('link').first().click()
            await page.goto(page.url() + '/kvittering')

            await expect(page.getByRole('heading', { name: VENTETID_HEADING })).not.toBeVisible()
            await expect(page.getByText(OPT_IN_READ_MORE)).not.toBeVisible()
        })
    })
})
