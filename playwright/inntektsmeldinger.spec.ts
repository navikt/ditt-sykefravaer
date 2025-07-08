import { expect } from '@playwright/test'

import { test } from './utils/fixtures'

test.describe('Inntektsmeldinger', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer')
    })

    test('Går til listevisning av inntektsmeldinger', async ({ page }) => {
        await page.getByRole('link', { name: /inntektsmeldinger/i }).click()
        await expect(page.locator('text=Inntektsmeldinger')).toBeVisible()
    })

    test('Åpner inntektsmelding', async ({ page }) => {
        await expect(page.locator('text=Inntektsmeldinger')).toBeVisible()

        await page.locator('text=Inntektsmeldinger').click()
        await page.getByText('Matbutikken AS, Kjelsås').waitFor()
        await page.getByText('Matbutikken AS, Kjelsås').click()

        await page.locator('text=Bestemmende fraværsdag').first().waitFor()

        await expect(page.locator('text=Bestemmende fraværsdag').first()).toBeVisible()
        await expect(page.locator('text=Matbutikken AS, Kjelsås')).toBeVisible()
        await expect(page.locator('text=Vi betviler at ansatt er ute av stand til å jobbe')).toBeVisible()
    })

    test('Går til listevisning uten inntektsmeldinger', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer/inntektsmeldinger?testperson=helt-frisk')
        await expect(page.locator('text=Du har ingen inntektsmeldinger som kan vises.')).toBeVisible()
    })

    test('Går til ikke eksisterende inntektsmelding', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer/inntektsmeldinger/213456?testperson=helt-frisk')
        await expect(page.locator('text=Fant ikke inntektsmelding')).toBeVisible()
    })
})
