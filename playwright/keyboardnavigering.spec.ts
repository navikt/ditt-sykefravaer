import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { tabUntilFocusedContainsText } from './utils/tastaturSnarvei'

test.describe('Keyboard navigering', () => {
    test('Vi navigerer forsiden med mange elementer', async ({ page, browserName }) => {
        await page.goto('/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
        await page.focus('#maincontent') // Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        const alertElement = await tabUntilFocusedContainsText(browserName, page, /Du har en ny søknad om sykepenger/)

        // Elegant løsning: Lagre en stabil referanse til det første elementet med denne teksten
        const lagretAlertElement = page.getByText('Du har en ny søknad om sykepenger').first()

        await expect(alertElement).toHaveCSS('color', 'rgb(255, 255, 255)')
        await expect(alertElement).toHaveCSS('background-color', 'rgb(0, 52, 125)')

        await tabUntilFocusedContainsText(
            browserName,
            page,
            /Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del/,
        )

        // Sjekk det lagrede elementet etter at fokus har flyttet seg
        await expect(lagretAlertElement).toHaveCSS('color', 'rgb(35, 38, 42)')
        await expect(lagretAlertElement).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

        await tabUntilFocusedContainsText(
            browserName,
            page,
            'Du har en oppfølgingsplan som venter på godkjenning av deg',
        )

        const focusedElement = await tabUntilFocusedContainsText(
            browserName,
            page,
            'Hogwarts School of Witchcraft and Wizardry',
        )
        await expect(focusedElement).toHaveCSS('box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')

        await page.keyboard.press('Space')
        await expect(
            page.locator('text=Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.'),
        ).toBeVisible()
        await page.keyboard.press('Enter')
        await expect(
            page.locator('text=Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.'),
        ).not.toBeVisible()

        await tabUntilFocusedContainsText(browserName, page, 'Sykmeldinger')

        const soknadElement = await tabUntilFocusedContainsText(browserName, page, 'Søknader')
        await expect(soknadElement).toHaveCSS('box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
    })

    test('Vi navigerer forsiden med lenke til manglende inntektsmelding', async ({ page, browserName }) => {
        await page.goto('/syk/sykefravaer?testperson=mangler-inntektsmelding')
        await expect(
            page.locator('text=Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.'),
        ).toBeVisible()
        await page.focus('#maincontent') // Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        // Første lenke er fokusert med riktig styling
        const statusLenke = await tabUntilFocusedContainsText(
            browserName,
            page,
            'Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.',
        )
        await expect(statusLenke).toHaveCSS('color', 'rgb(255, 255, 255)')
        await expect(statusLenke).toHaveCSS('background-color', 'rgb(0, 52, 125)')

        await page.keyboard.press('Enter')
        await expect(page).toHaveURL('/syk/sykefravaer/inntektsmelding')

        await expect(
            page.locator('text=For å få behandlet søknaden din raskere, kan du ta kontakt med arbeidsgiveren din'),
        ).toBeVisible()
    })
})
