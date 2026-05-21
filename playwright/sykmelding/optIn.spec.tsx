import { expect, test } from '@playwright/test'

import {
    bekreftSykmelding,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
} from '../utils/user-actions'

test.describe('Opt-in søknad for næringsdrivende/frilanser', () => {
    test('should show opt-in button when no søknad exists', async ({ page }) => {
        await gotoScenario('normal', {
            erForsteSykmelding: false,
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await bekreftSykmelding(page)

        await page.waitForURL('**/kvittering')

        const readMore = page.getByRole('button', { name: 'Om din rett til å søke om sykepenger' })
        await expect(readMore).toBeVisible()
        await readMore.click()

        await expect(page.getByRole('button', { name: 'Jeg vil søke om sykepenger' })).toBeVisible()
    })

    test('should show alert text when søknad already exists', async ({ page }) => {
        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/har-soknad*', (route) => {
            if (route.request().method() === 'GET') {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ harSoknad: true }),
                })
            }
            return route.continue()
        })

        await gotoScenario('normal', {
            erForsteSykmelding: false,
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await bekreftSykmelding(page)

        await page.waitForURL('**/kvittering')

        const readMore = page.getByRole('button', { name: 'Om din rett til å søke om sykepenger' })
        await expect(readMore).toBeVisible()
        await readMore.click()

        await expect(page.getByText('Du har en søknad for denne perioden.')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Jeg vil søke om sykepenger' })).not.toBeVisible()
    })

    test('should call opt-in endpoint when button is clicked', async ({ page }) => {
        let optInCalled = false
        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/opt-in*', (route) => {
            if (route.request().method() === 'POST') {
                optInCalled = true
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ status: 'ok' }),
                })
            }
            return route.continue()
        })

        await gotoScenario('normal', {
            erForsteSykmelding: false,
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await bekreftSykmelding(page)

        await page.waitForURL('**/kvittering')

        await page.getByRole('button', { name: 'Om din rett til å søke om sykepenger' }).click()
        await page.getByRole('button', { name: 'Jeg vil søke om sykepenger' }).click()

        expect(optInCalled).toBe(true)
    })

    test('should show error alert when har-soknad call fails', async ({ page }) => {
        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/har-soknad*', (route) => {
            if (route.request().method() === 'GET') {
                return route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Internal Server Error' }),
                })
            }
            return route.continue()
        })

        await gotoScenario('normal', {
            erForsteSykmelding: false,
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await bekreftSykmelding(page)

        await page.waitForURL('**/kvittering')

        await page.getByRole('button', { name: 'Om din rett til å søke om sykepenger' }).click()

        await expect(page.getByText('Beklager, en feil oppstod. Vennligst prøv igjen senere.')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Jeg vil søke om sykepenger' })).not.toBeVisible()
    })

    test('should show error alert when opt-in call fails', async ({ page }) => {
        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/opt-in*', (route) => {
            if (route.request().method() === 'POST') {
                return route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Internal Server Error' }),
                })
            }
            return route.continue()
        })

        await gotoScenario('normal', {
            erForsteSykmelding: false,
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await bekreftSykmelding(page)

        await page.waitForURL('**/kvittering')

        await page.getByRole('button', { name: 'Om din rett til å søke om sykepenger' }).click()
        await page.getByRole('button', { name: 'Jeg vil søke om sykepenger' }).click()

        await expect(page.getByText('Beklager, en feil oppstod. Vennligst prøv igjen senere.')).toBeVisible()
    })
})
