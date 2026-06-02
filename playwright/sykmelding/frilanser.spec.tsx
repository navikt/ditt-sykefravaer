import { expect, test } from '@playwright/test'

import {
    bekreftSykmelding,
    expectSykmeldingStartDato,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgForsikring,
} from '../utils/user-actions'
import { getRadioInGroup, userInteractionsGroup } from '../utils/test-utils'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

test.describe('Frilanser', () => {
    test.describe('Feil ved henting av data', () => {
        test('should disable submit button while data is loading', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-utenfor-ventetid',
                async (route) => {
                    if (route.request().method() === 'GET') {
                        await page.waitForTimeout(5000)
                        return route.continue()
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)

            await expect(page.getByText('Henter ekstra informasjon')).toBeVisible()
            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
            await page.unrouteAll({ behavior: 'ignoreErrors' })
        })

        test('should disable submit button when er-forste-sykmelding fails', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-forste-sykmelding/**',
                (route) => {
                    if (route.request().method() === 'GET') {
                        return route.fulfill({
                            status: 500,
                            contentType: 'application/json',
                            body: JSON.stringify({ message: 'Failed to fetch er-forste-sykmelding' }),
                        })
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)

            await expect(
                page.getByText(
                    /Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen/,
                ),
            ).toBeVisible()

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
        })

        test('should disable submit button when er-utenfor-ventetid fails', async ({ page }) => {
            await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-utenfor-ventetid', (route) => {
                if (route.request().method() === 'GET') {
                    return route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Failed to fetch er-utenfor-ventetid' }),
                    })
                }
                return route.continue()
            })

            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)

            await expect(
                page.getByText(
                    /Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen/,
                ),
            ).toBeVisible()

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
        })

        test('should disable submit button while er-forste-sykmelding is loading', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-forste-sykmelding/**',
                async (route) => {
                    if (route.request().method() === 'GET') {
                        await page.waitForTimeout(5000)
                        return route.continue()
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)

            await expect(page.getByText('Henter ekstra informasjon')).toBeVisible()
            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
            await page.unrouteAll({ behavior: 'ignoreErrors' })
        })
    })

    test.describe('Er forste sykmelding', () => {
        test('should be able to submit form with egenmeldingsperiode and forsikring', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    erForsteSykmelding: true,
                }),
                navigateToFirstSykmelding('nye', '100%'),
                opplysingeneStemmer,
                velgArbeidssituasjon('frilanser'),
                expectSykmeldingStartDato(`${testAar}-01-08`),
                frilanserEgenmeldingsperioder([{ fom: `28.12.${testAar - 1}` }]),
                velgForsikring('Ja'),
                bekreftSykmelding,
            )(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Frilanser',
                selvstendig: {
                    egenmeldingsperioder: [`28. desember ${testAar - 1}`],
                    forsikring: 'Ja',
                },
            })(page)
        })
    })

    test.describe('Er ikke forste sykmelding', () => {
        test('should be able to submit form', async ({ page }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: false,
                erUtenforVentetid: true,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)

            await bekreftSykmelding(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Frilanser',
                selvstendig: {
                    egenmeldingsperioder: ExpectMeta.NotInDom,
                    forsikring: ExpectMeta.NotInDom,
                },
            })(page)
        })
    })

    test.describe('Egenmeldingsperioder', () => {
        test('should show error message with link if date is missing', async ({ page }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: true,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)
            await getRadioInGroup(page)(
                { name: /Var du syk og borte fra jobb før du ble sykmeldt/i },
                { name: 'Ja' },
            ).click()
            await getRadioInGroup(page)(
                { name: /Ga du beskjed til Nav om at du var syk, før du fikk sykmelding?/i },
                { name: 'Ja' },
            ).click()

            await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()
            await expect(page.getByRole('link', { name: 'Du må fylle inn en dato.' })).toBeVisible()
        })

        test('should show error message with link if date is invalid format', async ({ page }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: true,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)
            await frilanserEgenmeldingsperioder([{ fom: '11.20.2020' }])(page)

            await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()

            await expect(page.getByRole('link', { name: 'Datoen må være på formatet DD.MM.YYYY.' })).toBeVisible()
        })

        test('should show error message with link if fom is after sykmelding fom', async ({ page }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: true,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)
            await frilanserEgenmeldingsperioder([{ fom: `8.1.${testAar}` }])(page)

            await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()

            await expect(
                page.getByRole('link', { name: 'Datoen kan ikke være på eller etter sykmeldingens start-dato.' }),
            ).toBeVisible()
        })

        test('should be able to submit form without egenmeldingsperioder and forsikring', async ({ page }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: true,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('frilanser')(page)
            await frilanserEgenmeldingsperioder('Nei')(page)
            await velgForsikring('Nei')(page)
            await bekreftSykmelding(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Frilanser',
                selvstendig: {
                    egenmeldingsperioder: 'Nei',
                    forsikring: 'Nei',
                },
            })(page)
        })
    })
})
