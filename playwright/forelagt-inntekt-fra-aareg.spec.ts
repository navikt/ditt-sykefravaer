import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Tester forelagt inntekt fra Aareg ', () => {
    test('Har varsel om innhentet opplysninger fra Aa-registeret', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=hentet-inntektsmelding-fra-aareg')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)
        const alertText =
            'Vi har hentet opplysninger om inntekten din fra Aa-registeret. Vi trenger at du sjekker om de stemmer.'
        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL(
            'http://localhost:3000/syk/sykefravaer/beskjed/123456y7?testperson=hentet-inntektsmelding-fra-aareg',
        )

        const header = page.locator('main').locator('h1').first()
        await expect(header).toBeVisible()

        await expect(header).toContainText('Vi har hentet opplysninger fra A-ordningen')

        await expect(page.locator('text=Vi har fortsatt ikke mottatt inntektsmelding fra')).toBeVisible()
        await expect(
            page.locator(
                'text=Det kan være tilfeller hvor du har hatt høyere eller lavere inntekt enn det som er registrert',
            ),
        ).toBeVisible()
    })
})
