import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Keyboard navigering', () => {
    test('Vi navigerer forsiden med mange elementer', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
        await page.focus('#maincontent') // Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')

        // Første lenke er fokusert med riktig styling
        await expect(page.locator(':focus')).toHaveText('Du har en ny søknad om sykepenger')
        await expect(page.locator(':focus')).toHaveCSS('color', 'rgb(255, 255, 255)')
        await expect(page.locator(':focus')).toHaveCSS('background-color', 'rgb(0, 52, 125)')

        await page.keyboard.press('Tab')
        // Stylingen er ikke fokusert igjen
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toHaveCSS('color', 'rgb(35, 38, 42)')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toHaveCSS(
            'background-color',
            'rgba(0, 0, 0, 0)',
        )

        await expect(page.locator(':focus')).toHaveText(
            'Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.',
        )
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toHaveText('Du har en oppfølgingsplan som venter på godkjenning av deg')

        await page.keyboard.press('Tab')
        const focusedElement = await page.locator(':focus')
        await expect(focusedElement).toHaveCSS('box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')

        await expect(focusedElement).toContainText('Hogwarts School of Witchcraft and Wizardry')

        await page.keyboard.press('Space')
        await expect(
            page.locator('text=Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.'),
        ).toBeVisible()
        await page.keyboard.press('Enter')
        await expect(
            page.locator('text=Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.'),
        ).not.toBeVisible()

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toContainText('Sykmeldinger')
        await page.keyboard.press('Tab')

        await expect(page.locator(':focus')).toContainText('Søknader')
        await expect(page.locator(':focus')).toHaveCSS('box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
    })

    test('Vi navigerer forsiden med lenke til manglende inntektsmelding', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=mangler-inntektsmelding')
        await expect(
            page.locator('text=Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.'),
        ).toBeVisible()
        await page.focus('#maincontent') // Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')

        // Første lenke er fokusert med riktig styling
        await expect(page.locator(':focus')).toHaveText(
            'Status i saken din om sykepenger: Vi venter på inntektsmelding fra Flex AS.',
        )
        await expect(page.locator(':focus')).toHaveCSS('color', 'rgb(255, 255, 255)')
        await expect(page.locator(':focus')).toHaveCSS('background-color', 'rgb(0, 52, 125)')

        await page.keyboard.press('Enter')
        await expect(page).toHaveURL('http://localhost:3000/syk/sykefravaer/inntektsmelding')

        await expect(
            page.locator('text=For å få behandlet søknaden din raskere, kan du ta kontakt med arbeidsgiveren din'),
        ).toBeVisible()
    })
})
