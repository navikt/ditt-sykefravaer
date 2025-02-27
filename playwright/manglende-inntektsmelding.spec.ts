import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Tester inntektsmelding', () => {
    test('Har inntektsmelding varsel og riktig innhold', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=mangler-inntektsmelding')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)
        const alertText =
            'Vi venter på inntektsmelding fra Flex AS. Når vi får den kan vi behandle søknaden om sykepenger du sendte 1. juli 2022.'
        await expect(navdsAlert).toContainText(alertText)
        await navdsAlert.click()

        await expect(page).toHaveURL('http://localhost:3000/syk/sykefravaer/inntektsmelding')

        const header = page.locator('main').locator('h1').first()
        await expect(header).toBeVisible()

        await expect(header).toContainText('Vi venter på inntektsmelding fra arbeidsgiver')

        await expect(
            page.locator(
                'text=Vi har bedt arbeidsgiveren din om å sende oss inntektsmelding, men ikke fått den enda. Nav trenger opplysninger fra inntektsmeldingen for å behandle søknaden din om sykepenger.',
            ),
        ).toBeVisible()
    })

    test('Mottatt inntektsmelding varsel kan lukkes', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=mottatt-inntektsmelding')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText = 'Status i saken din om sykepenger: ' + 'Vi venter på inntektsmelding fra Posten Norge AS'

        await expect(navdsAlert).toContainText(alertText)

        const closeButton = oppgaver.locator('.navds-alert .navds-button')
        await closeButton.click()

        await expect(oppgaver).not.toBeVisible()
    })
})
