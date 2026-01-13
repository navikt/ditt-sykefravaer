import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'

test.describe('Inntektsmeldinger', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer')
    })

    test('Går til listevisning av inntektsmeldinger', async ({ page, getCLS }) => {
        await page.getByRole('link', { name: /inntektsmeldinger/i }).click()

        const verifyInntektsmeldingPanel = async (navn: string) => {
            const panel = page.getByRole('link', { name: navn })
            await Promise.all([
                expect(panel.getByText(/For sykefravær som startet/i)).toBeVisible(),
                expect(panel.getByText(/Mottatt:/i)).toBeVisible(),
            ])
        }

        await Promise.all([
            verifyInntektsmeldingPanel('Matbutikken AS, Kjelsås'),
            verifyInntektsmeldingPanel('Matbutikken AS, Grefsen'),
        ])

        await validerCLS(getCLS, 'inntektsmeldinger list view')
    })

    test('Åpner inntektsmelding', async ({ page, getCLS }) => {
        await expect(page.locator('text=Inntektsmeldinger')).toBeVisible()

        await page.locator('text=Inntektsmeldinger').click()
        await page.getByText('Matbutikken AS, Kjelsås').waitFor()
        await page.getByText('Matbutikken AS, Kjelsås').click()

        await page.locator('text=Bestemmende fraværsdag').first().waitFor()

        await expect(page.locator('text=Bestemmende fraværsdag').first()).toBeVisible()
        await expect(page.locator('text=Matbutikken AS, Kjelsås')).toBeVisible()
        await expect(page.locator('text=Vi betviler at ansatt er ute av stand til å jobbe')).toBeVisible()

        await validerCLS(getCLS, 'inntektsmelding detail view')
    })

    test('Går til listevisning uten inntektsmeldinger', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmeldinger?testperson=helt-frisk')
        await expect(page.locator('text=Du har ingen inntektsmeldinger.')).toBeVisible()
    })

    test('Går til ikke eksisterende inntektsmelding', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmeldinger/213456?testperson=helt-frisk')
        await expect(page.locator('text=Fant ikke inntektsmelding')).toBeVisible()
    })
})
