import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { harSynligOverskrift } from './utils/test-utils'
import { validerAxe } from './utils/uuvalidering'

test.describe('Tester forelagt inntekt fra a-ordningen', () => {
    test('Tester når vi har tre månedsinntekter', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=forelagt-fra-a-ordningen')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.aksel-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await harSynligOverskrift(page, 'Sjekk at opplysningene om inntekten din stemmer', 1)
        await expect(page).toHaveURL('/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen')

        const header = page.locator('main').locator('h1').first()

        await expect(header).toBeVisible()
        await expect(header).toContainText('Sjekk at opplysningene om inntekten din stemmer')
        await expect(
            page.locator(
                'text=Vi har hentet opplysninger om inntekten din fra a-ordningen, fordi vi ikke har mottatt inntektsmelding fra arbeidsgiveren din. Sjekk at opplysningene om inntekten din stemmer.',
            ),
        ).toBeVisible()
        await expect(page.locator('text=Hvis opplysningene stemmer, trenger du ikke gjøre noe')).toBeVisible()

        await expect(page.locator('text=Inntekt hos')).toBeVisible()
        await expect(page.locator('text=Snekkeri AS')).toBeVisible()

        await expect(page.locator('text=2023')).toBeVisible()
        await expect(page.locator('text=Desember: 33 960 kroner')).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Januar: 0 kroner')).toBeVisible()
        await expect(page.locator('text=Februar: 33 960 kroner')).toBeVisible()

        await expect(page.getByRole('button', { name: 'Meld fra om endringer' })).toBeVisible()
    })

    test('Tester når vi har kun en av tre månedsinntekt', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=forelagt-fra-a-ordningen-en-maned')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.aksel-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL('/syk/sykefravaer/beskjed/123456y8?testperson=forelagt-fra-a-ordningen-en-maned')

        await expect(page.locator('text=Snekkeri AS')).toBeVisible()

        await expect(page.locator('text=2023')).toBeVisible()
        await expect(page.locator('text=Desember: Ingen inntekt registrert')).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Februar: 40 000 kroner')).toBeVisible()
        await expect(page.locator('text=Januar: Ingen inntekt registrert')).toBeVisible()
    })

    test('Tester når vi har ingen av tre månedsinntekt', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=forelagt-fra-a-ordningen-ingen')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.aksel-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL('/syk/sykefravaer/beskjed/123456y9?testperson=forelagt-fra-a-ordningen-ingen')

        await expect(page.locator('text=Snekkeri AS')).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Mars: Ingen inntekt registrert')).toBeVisible()
        await expect(page.locator('text=Februar: Ingen inntekt registrert')).toBeVisible()
        await expect(page.locator('text=Januar: Ingen inntekt registrert')).toBeVisible()
    })

    test('viser melding etter at den er hentet', async ({ page }) => {
        let fortsettHenting: () => void = () => undefined
        const ventPaHenting = new Promise<void>((resolve) => {
            fortsettHenting = resolve
        })

        await page.route('**/api/ditt-sykefravaer-backend/api/v1/meldinger**', async (route) => {
            await ventPaHenting
            await route.continue()
        })

        const url = '/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen'
        try {
            await page.goto(url)
            await expect(page.locator('.aksel-skeleton').first()).toBeVisible()
            await expect(page).toHaveURL(url)
        } finally {
            fortsettHenting()
        }

        await expect(
            page.getByRole('heading', { name: 'Sjekk at opplysningene om inntekten din stemmer' }),
        ).toBeVisible()
        await expect(page).toHaveURL(url)
    })

    test('viser ikke funnet og lar brukeren gå til oversikten når meldingen ikke finnes', async ({
        page,
    }, testInfo) => {
        const dokumentforesporsler: string[] = []
        page.on('request', (request) => {
            if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
                dokumentforesporsler.push(request.url())
            }
        })

        const url = '/syk/sykefravaer/beskjed/ukjent?testperson=forelagt-fra-a-ordningen'
        await page.goto(url)

        await expect(page.getByRole('heading', { name: 'Fant ikke beskjeden', level: 1 })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Vi klarte ikke å hente beskjeden' })).toBeHidden()
        await expect(page).toHaveURL(url)

        await validerAxe(page, testInfo)

        const tilOversikten = page.getByRole('link', { name: 'Gå til Ditt sykefravær' })
        await expect(tilOversikten).toHaveAttribute('href', '/syk/sykefravaer')
        await tilOversikten.click()

        await expect(page).toHaveURL(/\/syk\/sykefravaer\/?$/)
        expect(dokumentforesporsler).toHaveLength(1)
    })

    test('viser teknisk feil og lar brukeren hente beskjeden på nytt', async ({ page }) => {
        let laHentingLykkes = false

        await page.route('**/api/ditt-sykefravaer-backend/api/v1/meldinger**', async (route) => {
            if (laHentingLykkes) {
                await route.continue()
            } else {
                await route.fulfill({ status: 500, body: 'Feil ved henting av meldinger' })
            }
        })

        const url = '/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen'
        await page.goto(url)

        await expect(page.getByRole('alert').filter({ hasText: 'Vi klarte ikke å hente beskjeden' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Fant ikke beskjeden' })).toBeHidden()
        await expect(page).toHaveURL(url)

        laHentingLykkes = true
        await page.getByRole('button', { name: 'Prøv igjen' }).click()

        await expect(
            page.getByRole('heading', { name: 'Sjekk at opplysningene om inntekten din stemmer' }),
        ).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Vi klarte ikke å hente beskjeden' })).toBeHidden()
        await expect(page).toHaveURL(url)
    })

    test('beholder teknisk feil når et nytt forsøk også feiler', async ({ page }) => {
        let antallHentinger = 0
        await page.route('**/api/ditt-sykefravaer-backend/api/v1/meldinger**', (route) => {
            antallHentinger++
            return route.fulfill({ status: 500, body: 'Feil ved henting av meldinger' })
        })

        const url = '/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen'
        await page.goto(url)
        await expect(page.getByRole('heading', { name: 'Vi klarte ikke å hente beskjeden', level: 1 })).toBeVisible()
        const hentingerForNyttForsok = antallHentinger

        await page.getByRole('button', { name: 'Prøv igjen' }).click()

        await expect.poll(() => antallHentinger).toBeGreaterThan(hentingerForNyttForsok)
        await expect(page.getByRole('heading', { name: 'Vi klarte ikke å hente beskjeden', level: 1 })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Prøv igjen' })).toBeEnabled()
        await expect(page.getByRole('heading', { name: 'Fant ikke beskjeden' })).toBeHidden()
        await expect(page).toHaveURL(url)
    })
})
