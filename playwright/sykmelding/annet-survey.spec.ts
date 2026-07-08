import { expect } from '@playwright/test'

import {
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
} from '../utils/user-actions'
import { test } from '../utils/fixtures'

test.describe('Annet arbeidssituasjon survey', () => {
    test.beforeEach(async ({ page }) => {
        await gotoScenario()(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
    })

    test('viser survey når bruker velger Annet', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)

        await expect(page.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).toBeVisible()
        await expect(page.getByText('Svarene dine er anonyme')).toBeVisible()
        await expect(
            page.getByText('Dette er ikke en del av sykmeldingen din. Svarene går ikke til saksbehandleren din.'),
        ).toBeVisible()
        await expect(page.getByText('Hva er grunnen til at ingen av alternativene passet?')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Send tilbakemelding' })).toBeVisible()
    })

    test('viser ikke survey når bruker velger annen situasjon', async ({ page }) => {
        await velgArbeidssituasjon('frilanser')(page)

        await expect(page.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).not.toBeVisible()
    })

    test('kan sende inn survey med valgt årsak', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)

        await page.getByRole('radio', { name: 'Jeg er pensjonist' }).click()
        await page.getByLabel(/Skriv hvilken arbeidssituasjon/i).fill('Pensjonert, men jobber litt ved siden av')

        const [request] = await Promise.all([
            page.waitForRequest((req) => req.url().includes('/flexjar-backend/api/v2/feedback')),
            page.getByRole('button', { name: 'Send tilbakemelding' }).click(),
        ])

        const postData = JSON.parse(request.postData() || '{}')
        expect(postData).toMatchObject({
            feedbackId: 'arbeidssituasjon-annet',
            svar: 'Jeg er pensjonist',
            feedback: 'Pensjonert, men jobber litt ved siden av',
        })

        await expect(page.getByText('Takk for tilbakemeldingen!')).toBeVisible()
    })

    test('viser valideringsfeil ved send uten å velge årsak', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)

        await page.getByRole('button', { name: 'Send tilbakemelding' }).click()

        await expect(page.getByText('Du må velge en årsak.')).toBeVisible()
    })

    test('viser alert og ikke survey når toggle er av', async ({ page }) => {
        await page.goto(page.url().replace(/\?.*/, '') + '?toggle_flexjar-arbeidssituasjon-annet-survey=false')
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('annet')(page)

        await expect(page.getByText('Sykmeldingen gjelder arbeidet du er sykmeldt fra')).toBeVisible()
        await expect(page.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).not.toBeVisible()
    })
})
