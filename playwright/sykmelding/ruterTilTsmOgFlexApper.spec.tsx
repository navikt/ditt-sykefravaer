import { expect, Page } from '@playwright/test'

import { test } from '../utils/fixtures'

const SYKMELDINGER_PATH = '/syk/sykefravaer/sykmeldinger'

async function expectToBeRedirected(page: Page, expectedPathname?: string) {
    // Redirect url inkluderer query param 'redirected-to-tsm'. Se .env
    await expect(page).toHaveURL((url) => {
        return (
            url.searchParams.has('redirected-to-tsm') && (expectedPathname ? url.pathname === expectedPathname : true)
        )
    })
}

async function expectToStayOnPage(page: Page, expectedPathname?: string) {
    await expect(page).toHaveURL((url) => {
        return (
            !url.searchParams.has('redirected-to-tsm') && (expectedPathname ? url.pathname === expectedPathname : true)
        )
    })
}

test.describe('Sykmeldinger ruter mellom Team Sykmelding app og denne', () => {
    test('burde rute til TSM app når toggle er av', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false')
        await expectToBeRedirected(page, SYKMELDINGER_PATH)
    })

    test('burde bli på sykmeldinger side når toggle er på', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true')
        await expectToStayOnPage(page, SYKMELDINGER_PATH)
    })

    test('burde alltid bli på sykmeldinger side når query param app=flex', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger' +
                '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false' +
                '&app=flex',
        )
        await expectToStayOnPage(page, SYKMELDINGER_PATH)
    })

    test('burde alltid rute til TSM app når query param app=tsm', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger?' + 'toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true' + '&app=tsm',
        )
        await expectToBeRedirected(page, SYKMELDINGER_PATH)
    })
})

test.describe('Spesifikk Sykmelding side ruter mellom Team Sykmelding app og denne', () => {
    test('Burde ikke rutes til Team sykmelding dersom unleash er på', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger/id-apen-sykmelding' +
                '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true',
        )
        await expectToStayOnPage(page, `${SYKMELDINGER_PATH}/id-apen-sykmelding`)
    })

    test('Burde rutes til Team sykmelding dersom unleash er av', async ({ page }) => {
        await page.goto(
            '/syk/sykefravaer/sykmeldinger/id-apen-sykmelding' +
                '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false',
        )
        await expectToBeRedirected(page, `${SYKMELDINGER_PATH}/id-apen-sykmelding`)
    })
})
