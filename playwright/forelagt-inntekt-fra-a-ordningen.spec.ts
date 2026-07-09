import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { harSynligOverskrift } from './utils/test-utils'

test.describe('Tester forelagt inntekt fra a-ordningen', () => {
    test('Tester når vi har tre månedsinntekter', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=forelagt-fra-a-ordningen')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
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
        const navdsAlert = oppgaver.locator('.navds-alert')
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
        const navdsAlert = oppgaver.locator('.navds-alert')
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
})
