import { expect, test } from './utils/fixtures'
import { harSynligOverskrift, harSynligTekst } from './utils/test-utils'

test.describe('Beskjeder', () => {
    test('åpner inntektsbeskjeden fra testdataverktøyet', async ({ page }) => {
        await page.goto('/syk/sykefravaer')
        await page.getByRole('button', { name: 'Verktøy for testing' }).click()
        await harSynligOverskrift(page, 'Varsler om forsinket saksbehandling', 4, true)
        await page
            .getByRole('link', {
                name: 'Opplysninger om inntekt hentet fra a-ordningen (3 måneder med inntekt)',
                exact: true,
            })
            .click()
        await page
            .getByTestId('oppgaver')
            .getByRole('link', { name: /Vi har hentet opplysninger om inntekten din/ })
            .click()

        await expect(page).toHaveURL('/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen')
        await harSynligOverskrift(page, 'Sjekk at opplysningene om inntekten din stemmer', 1)
    })

    test('viser en vanlig beskjed', async ({ page }) => {
        await page.goto('/syk/sykefravaer/beskjed/123456y7?testperson=mottatt-inntektsmelding')

        await harSynligOverskrift(page, 'Beskjed fra Nav', 1)
        await harSynligTekst(
            page,
            'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.',
        )
    })

    for (const { status, overskrift } of [
        { status: 200, overskrift: 'Fant ikke beskjeden' },
        { status: 403, overskrift: 'Du har ikke tilgang til beskjeden' },
        { status: 404, overskrift: 'Fant ikke beskjeden' },
        { status: 500, overskrift: 'Vi klarte ikke å hente beskjeden' },
    ]) {
        test(`viser riktig feilvisning ved API-status ${status}`, async ({ page }) => {
            await page.route('**/api/ditt-sykefravaer-backend/api/v1/meldinger**', (route) =>
                route.fulfill({ status, json: status === 200 ? [] : { message: 'Kunne ikke hente beskjeden' } }),
            )
            const url = '/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen'
            const [response] = await Promise.all([
                page.waitForResponse((response) =>
                    response.url().includes('/api/ditt-sykefravaer-backend/api/v1/meldinger'),
                ),
                page.goto(url),
            ])

            expect(response.status()).toBe(status)
            await harSynligOverskrift(page, overskrift, 1)
            await expect(page).toHaveURL(url)
            const knapp = status === 500 ? 'Last inn siden på nytt' : 'Gå tilbake til Ditt sykefravær'
            await expect(page.getByRole('button', { name: knapp })).toBeVisible()
        })
    }

    test('viser lastetilstand før den trege beskjeden vises', async ({ page }) => {
        let fortsettHenting: () => void = () => undefined
        const ventPaHenting = new Promise<void>((resolve) => {
            fortsettHenting = resolve
        })
        await page.route('**/api/ditt-sykefravaer-backend/api/v1/meldinger**', async (route) => {
            await ventPaHenting
            await route.continue()
        })

        try {
            await page.goto('/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen')
            await expect(page.locator('.aksel-skeleton').first()).toBeVisible()
            await expect(page.getByRole('heading', { name: 'Fant ikke beskjeden' })).toBeHidden()
        } finally {
            fortsettHenting()
        }
        await harSynligOverskrift(page, 'Sjekk at opplysningene om inntekten din stemmer', 1)
    })
})
