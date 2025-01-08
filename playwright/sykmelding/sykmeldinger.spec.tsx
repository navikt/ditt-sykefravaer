import { test, expect } from '@playwright/test'

import {
    createSykmelding,
    createAvvistBehandlingsutfall,
    createUnderBehandlingMerknad,
} from '../../src/utils/test/dataUtils'
import { StatusEvent } from '../../src/fetching/graphql.generated'

test.describe('SykmeldingerPage: /syk/sykmeldinger', () => {
    test('should fail with error message on API error', async ({ page }) => {
        await page.route('**/graphql', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: null,
                    errors: [{ message: 'Some backend error' }],
                    extensions: { dontLog: true },
                }),
            })
        })

        await page.goto('/syk/sykmeldinger')
        await expect(page.locator('text=Vi har problemer med baksystemene for øyeblikket.')).toBeVisible()
    })

    test('should not display any sykmeldinger', async ({ page }) => {
        await page.route('**/graphql', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: {
                        __typename: 'Query',
                        sykmeldinger: [],
                    },
                }),
            })
        })

        await page.goto('/syk/sykmeldinger')
        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
    })

    test('should only display new sykmeldinger', async ({ page }) => {
        await page.route('**/graphql', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: {
                        __typename: 'Query',
                        sykmeldinger: [
                            createSykmelding({ id: 'sykme-1' }, StatusEvent.BEKREFTET),
                            createSykmelding({ id: 'sykme-2' }, StatusEvent.SENDT),
                            createSykmelding({ id: 'sykme-3' }, StatusEvent.AVBRUTT),
                            createSykmelding(
                                { id: 'sykme-4', ...createAvvistBehandlingsutfall() },
                                StatusEvent.BEKREFTET,
                            ),
                            createSykmelding({ id: 'sykme-5' }, StatusEvent.UTGATT),
                        ],
                    },
                }),
            })
        })

        await page.goto('/syk/sykmeldinger')
        await page.waitForSelector('text=Henter dine sykmeldinger', { state: 'hidden' })

        await expect(page.locator('text=Du har ingen nye sykmeldinger')).toBeVisible()
        await expect(page.locator('text=Tidligere sykmeldinger')).toBeVisible()

        await expect(page.getByRole('link', { name: /Sendt til NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Sendt til arbeidsgiver/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avbrutt av deg/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Avvist av NAV/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Utgått/ })).toBeVisible()
    })

    test('should display under behandling in separate section', async ({ page }) => {
        await page.route('**/graphql', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: {
                        __typename: 'Query',
                        sykmeldinger: [
                            createSykmelding({ id: 'sykme-1', ...createUnderBehandlingMerknad() }, StatusEvent.SENDT),
                        ],
                    },
                }),
            })
        })

        await page.goto('/syk/sykmeldinger')
        await page.waitForSelector('text=Henter dine sykmeldinger', { state: 'hidden' })

        const behandlingSection = page.getByRole('region', { name: 'Under behandling' })
        const sykmeldinger = await behandlingSection.locator('a')

        await expect(sykmeldinger).toHaveCount(1)
        await expect(sykmeldinger.nth(0)).toHaveText(/Sendt til arbeidsgiver/)
    })
})
