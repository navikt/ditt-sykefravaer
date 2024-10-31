import { test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Keyboard navigering', () => {
    test('Vi navigerer forsiden med mange elementer', async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer')
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

    test('Vi navigerer forsiden med lenke til mangelnde inntektsmelding', async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')
        await expect(
            page.locator(
                'text=Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.',
            ),
        ).toBeVisible()
        await page.focus('#maincontent') // Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')

        // Første lenke er fokusert med riktig styling
        await expect(page.locator(':focus')).toHaveText(
            'Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.',
        )
        await expect(page.locator(':focus')).toHaveCSS('color', 'rgb(255, 255, 255)')
        await expect(page.locator(':focus')).toHaveCSS('background-color', 'rgb(0, 52, 125)')

        await page.keyboard.press('Enter')
        await expect(page).toHaveURL('http://localhost:8080/syk/sykefravaer/inntektsmelding')

        await expect(page.locator('text=Vi har varslet arbeidsgiveren din om dette')).toBeVisible()
    })
})
