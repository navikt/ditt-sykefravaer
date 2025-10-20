import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { harSynligOverskrift } from './utils/test-utils'

test.describe('Tester forelagt inntekt fra a-ordningen', () => {
    test('Tester når vi har tre månedsinntekter', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=forelagt-fra-a-ordningen')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await harSynligOverskrift(page, 'Vi har hentet opplysninger fra a-ordningen', 1)
        await expect(page).toHaveURL(
            'http://localhost:3000/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen',
        )

        const header = page.locator('main').locator('h1').first()

        await expect(header).toBeVisible()
        await expect(header).toContainText('Vi har hentet opplysninger fra a-ordningen')
        await expect(page.locator('text=Vi har fortsatt ikke mottatt inntektsmelding fra Snekkeri AS')).toBeVisible()
        await expect(
            page.locator('text=Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før'),
        ).toBeVisible()

        await expect(page.locator('text=2023')).toBeVisible()
        await expect(page.locator('text=Desember: 33 960 kroner')).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Januar: 0 kroner')).toBeVisible()
        await expect(page.locator('text=Februar: 33 960 kroner')).toBeVisible()

        // Navigerer til ditt sykefravær
        await expect(page.getByRole('link', { name: /Tilbake til Ditt sykefravær/ })).toBeVisible()

        await page.click('text=Tilbake til Ditt sykefravær')
        await expect(page).toHaveURL('http://localhost:3000/syk/sykefravaer?testperson=forelagt-fra-a-ordningen')
    })

    test('Tester når vi har kun en av tre månedsinntekt', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=forelagt-fra-a-ordningen-en-maned')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL(
            'http://localhost:3000/syk/sykefravaer/beskjed/123456y8?testperson=forelagt-fra-a-ordningen-en-maned',
        )

        await expect(page.locator('text=Vi har fortsatt ikke mottatt inntektsmelding fra Snekkeri AS')).toBeVisible()
        await expect(
            page.locator('text=Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før'),
        ).toBeVisible()

        await expect(page.locator('text=2023')).toBeVisible()
        await expect(page.locator('text=Desember: Ingen inntekt registrert')).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Februar: 40 000 kroner')).toBeVisible()
        await expect(page.locator('text=Januar: Ingen inntekt registrert')).toBeVisible()
    })

    test('Tester når vi har ingen av tre månedsinntekt', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=forelagt-fra-a-ordningen-ingen')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText =
            'Vi har hentet opplysninger om inntekten din fra a-ordningen for sykefraværet. Vi trenger at du sjekker om de stemmer.'

        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL(
            'http://localhost:3000/syk/sykefravaer/beskjed/123456y9?testperson=forelagt-fra-a-ordningen-ingen',
        )

        await expect(page.locator('text=Vi har fortsatt ikke mottatt inntektsmelding fra Snekkeri AS')).toBeVisible()
        await expect(
            page.locator('text=Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før'),
        ).toBeVisible()

        await expect(page.locator('text=2024')).toBeVisible()
        await expect(page.locator('text=Mars: Ingen inntekt registrert')).toBeVisible()
        await expect(page.locator('text=Februar: Ingen inntekt registrert')).toBeVisible()
        await expect(page.locator('text=Januar: Ingen inntekt registrert')).toBeVisible()
    })
})
