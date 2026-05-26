import { expect, test } from '@playwright/test'

import {
    bekreftSykmelding,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
} from '../utils/user-actions'

test.describe('Opt-in søknad for næringsdrivende/frilanser', () => {
    let mottattTidspunktForTest: string

    test.beforeEach(async ({ page }) => {
        mottattTidspunktForTest = new Date().toISOString()

        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/id-apen-sykmelding', async (route) => {
            if (route.request().method() === 'GET') {
                const response = await route.fetch()
                const json = await response.json()
                json.mottattTidspunkt = mottattTidspunktForTest
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(json),
                })
            }
            return route.continue()
        })
    })

    test('viser opt-in-knapp når ingen søknad finnes', async ({ page }) => {
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

    test('viser varsel når søknad allerede finnes', async ({ page }) => {
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

    test('viser info-alert etter vellykket opt-in', async ({ page }) => {
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
        await expect(
            page.getByRole('heading', { name: 'Vi oppretter søknad etter sykmeldingsperioden er over' }),
        ).toBeVisible()
        await expect(
            page.getByText(
                'Du vil få beskjed av oss når du skal fylle ut og sende inn søknaden om sykepenger for sykmeldingsperioden.',
            ),
        ).toBeVisible()
    })

    test('kaller opt-in-endepunktet når knappen trykkes', async ({ page }) => {
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

    test('viser feilvarsel når har-soknad-kallet feiler', async ({ page }) => {
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

    test('viser feilvarsel når opt-in-kallet feiler', async ({ page }) => {
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

    test('viser varsel når sykmeldingen er eldre enn 4 måneder', async ({ page }) => {
        mottattTidspunktForTest = new Date('2025-01-01').toISOString()

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

        await expect(page.getByText('Søknadsfristen er gått ut')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Jeg vil søke om sykepenger' })).not.toBeVisible()
    })
})
