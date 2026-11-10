import { expect, test } from './utils/fixtures'
import { harSynligOverskrift, harSynligTekst } from './utils/test-utils'

test.describe('Demoscenarioer for beskjeder', () => {
    test('åpner inntektsbeskjeden fra testdataverktøyet', async ({ page }) => {
        await page.goto('/syk/sykefravaer')
        await page.getByRole('button', { name: 'Verktøy for testing' }).click()
        await harSynligOverskrift(page, 'Beskjeder', 4, true)
        await page.getByRole('link', { name: 'Beskjed med inntekt fra a-ordningen', exact: true }).click()

        await expect(page).toHaveURL('/syk/sykefravaer/beskjed/123456y7?testperson=beskjed-forelagt-inntekt')
        await harSynligOverskrift(page, 'Sjekk at opplysningene om inntekten din stemmer', 1)
    })

    test('viser en vanlig beskjed', async ({ page }) => {
        await page.goto('/syk/sykefravaer/beskjed/123456y7?testperson=beskjed-vanlig-melding')

        await harSynligOverskrift(page, 'Beskjed fra Nav', 1)
        await harSynligTekst(
            page,
            'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.',
        )
    })

    for (const { testperson, status, overskrift } of [
        { testperson: 'beskjed-mangler', status: 200, overskrift: 'Fant ikke beskjeden' },
        { testperson: 'beskjed-ingen-tilgang', status: 403, overskrift: 'Du har ikke tilgang til beskjeden' },
        { testperson: 'beskjed-ikke-funnet', status: 404, overskrift: 'Fant ikke beskjeden' },
        { testperson: 'beskjed-teknisk-feil', status: 500, overskrift: 'Vi klarte ikke å hente beskjeden' },
    ]) {
        test(`viser ${testperson} fra mock-API-et`, async ({ page }) => {
            const url = `/syk/sykefravaer/beskjed/123456y7?testperson=${testperson}`
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
        await page.goto('/syk/sykefravaer/beskjed/123456y7?testperson=beskjed-treg-henting')

        await expect(page.locator('.aksel-skeleton').first()).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Fant ikke beskjeden' })).toBeHidden()
        await harSynligOverskrift(page, 'Sjekk at opplysningene om inntekten din stemmer', 1)
    })
})
