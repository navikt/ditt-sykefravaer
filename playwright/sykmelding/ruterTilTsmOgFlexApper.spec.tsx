import { expect } from '@playwright/test'

import { test } from '../utils/fixtures'

const SYKMELDINGER_REDIRECT_PATH = '/syk/sykefravaer/sykmeldinger?app=flex'

test.describe('Sykmeldinger ruter mellom Team Sykmelding app og denne', () => {
    test('burde rute til TSM app når toggle er av', async ({ page }, testInfo) => {
        const response = await page.goto(
            '/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false',
        )

        const baseURL = testInfo.project.use.baseURL
        expect(response?.url()).toBe(baseURL + SYKMELDINGER_REDIRECT_PATH)
    })

    test('burde bli på sykmeldinger side når toggle er på', async ({ page }, testInfo) => {
        const response = await page.goto(
            '/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true',
        )
        const baseURL = testInfo.project.use.baseURL
        const expectedNonRedirectPath =
            '/syk/sykefravaer/sykmeldinger?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true'
        expect(response?.url()).toBe(baseURL + expectedNonRedirectPath)
    })

    test('burde alltid bli på sykmeldinger side når query param app=flex', async ({ page }, testInfo) => {
        const response = await page.goto(
            '/syk/sykefravaer/sykmeldinger' +
                '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false' +
                '&app=flex',
        )
        const expectedNonRedirectPath =
            '/syk/sykefravaer/sykmeldinger' +
            '?toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=false' +
            '&app=flex'

        const baseURL = testInfo.project.use.baseURL

        expect(response?.url()).toBe(baseURL + expectedNonRedirectPath)
    })

    test('burde alltid rute til TSM app når query param app=tsm', async ({ page }, testInfo) => {
        const response = await page.goto(
            '/syk/sykefravaer/sykmeldinger?' + 'toggle_ditt-sykefravaer-sykmelding-gradvis-utrulling=true' + '&app=tsm',
        )
        const baseURL = testInfo.project.use.baseURL
        expect(response?.url()).toBe(baseURL + SYKMELDINGER_REDIRECT_PATH)
    })
})
