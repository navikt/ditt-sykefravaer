import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { apneReadmore, harSynligOverskrift, harSynligTekst } from './utils/test-utils'

test.describe('Tester inntektsmelding', () => {
    test('Har inntektsmelding varsel og riktig innhold', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=venter-pa-inntektsmelding')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)

        const alertText = 'Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.'
        await expect(navdsAlert).toContainText(alertText)

        await navdsAlert.locator('a').click()

        await expect(page).toHaveURL('/syk/sykefravaer/inntektsmelding')

        await harSynligOverskrift(page, 'Vi venter på opplysninger fra arbeidsgiveren din', 1)

        await harSynligTekst(
            page,
            'Vi har bedt arbeidsgiveren din om å sende oss inntektsmelding, men ikke mottatt den enda. Når vi får den, kan vi starte å behandle søknaden din.',
        )

        await apneReadmore(page, 'Hva er en inntektsmelding?', [
            'Nav trenger en inntektsmelding fra arbeidsgiveren din for å kunne behandle søknaden.',
        ])
    })

    test('Mottatt inntektsmelding varsel kan lukkes', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=mottatt-inntektsmelding')

        const oppgaver = page.getByTestId('oppgaver')
        const navdsAlert = oppgaver.locator('.navds-alert')
        await expect(navdsAlert).toHaveCount(1)
        const alertText =
            'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.'
        await expect(navdsAlert).toContainText(alertText)

        const closeButton = oppgaver.locator('.navds-alert .navds-button')
        await closeButton.click()

        await expect(oppgaver).not.toBeVisible()
    })
})
