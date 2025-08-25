import { expect, Page } from '@playwright/test'

import { test } from '../utils/fixtures'
import { navigateToFirstSykmelding } from '../utils/user-actions'

async function expectToBeRedirected(page: Page) {
    // Redirect url inkluderer query param 'redirected-to-tsm'. Se .env
    await expect(page).toHaveURL((url) => {
        return url.searchParams.has('redirected-to-tsm')
    })
}

async function expectToStayOnPage(page: Page) {
    await expect(page).not.toHaveURL((url) => {
        return url.searchParams.has('redirected-to-tsm')
    })
}

test.describe('Sykmeldinger ruter mellom Team Sykmelding app og denne', () => {
    test('burde rute til TSM app når toggle er av', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false')
        await expectToBeRedirected(page)
    })

    test('burde bli på sykmeldinger side når toggle er på', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true')
        await expectToStayOnPage(page)
    })

    test('burde alltid bli på sykmeldinger side når query param app=flex', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger' +
                '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false' +
                '&app=flex',
        )
        await expectToStayOnPage(page)
    })

    test('burde alltid rute til TSM app når query param app=tsm', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger?' + 'toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true' + '&app=tsm',
        )
        await expectToBeRedirected(page)
    })
})

test.describe('Spesifikk Sykmelding side ruter mellom Team Sykmelding app og denne', () => {
    test('Burde ikke rutes til Team sykmelding dersom unleash er på', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger' + '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true')
        await navigateToFirstSykmelding('nye', '100%')(page)
        await expectToStayOnPage(page)
    })

    test('Burde rutes til Team sykmelding dersom unleash er av', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger' + '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false')
        await navigateToFirstSykmelding('nye', '100%')(page)
        await expectToBeRedirected(page)
    })
})
