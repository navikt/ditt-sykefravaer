import { expect } from '@playwright/test'

import {
    bekreftSykmelding,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgForsikring,
} from '../utils/user-actions'
import { test } from '../utils/fixtures'

test.describe('Annet arbeidssituasjon survey', () => {
    test.beforeEach(async ({ page }) => {
        await gotoScenario()(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
    })

    test('viser survey-modal på kvittering når bruker valgte Annet', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const modal = page.getByRole('dialog')
        await expect(modal).toBeVisible()
        await expect(modal.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).toBeVisible()
        await expect(modal.getByText('Svarene dine er anonyme')).toBeVisible()
        await expect(
            modal.getByText('Dette er ikke en del av sykmeldingen din. Svarene går ikke til saksbehandleren din.'),
        ).toBeVisible()
        await expect(modal.getByText('Hva er grunnen til at du valgte arbeidssituasjon "annet"?')).toBeVisible()
        await expect(modal.getByRole('button', { name: 'Send tilbakemelding' })).toBeVisible()
        await expect(modal.getByRole('button', { name: 'Avbryt' })).toBeVisible()
    })

    test('kan lukke survey-modal med Avbryt-knapp', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const modal = page.getByRole('dialog')
        await expect(modal).toBeVisible()
        await modal.getByRole('button', { name: 'Avbryt' }).click()
        await expect(modal).not.toBeVisible()
    })

    test('viser ikke survey-modal på kvittering når bruker valgte annen situasjon', async ({ page }) => {
        await velgArbeidssituasjon('frilanser')(page)
        await frilanserEgenmeldingsperioder('Nei')(page)
        await velgForsikring('Nei')(page)

        await bekreftSykmelding(page)
        await expect(page.getByRole('dialog')).not.toBeVisible()
    })

    test('kan sende inn survey på kvittering med valgt årsak', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const modal = page.getByRole('dialog')
        await modal.getByRole('radio', { name: 'Annen årsak' }).click()
        await modal.getByLabel(/Skriv hvilken arbeidssituasjon/i).fill('Pensjonert, men jobber litt ved siden av')

        const [request] = await Promise.all([
            page.waitForRequest((req) => req.url().includes('/flexjar-backend/api/v2/feedback')),
            modal.getByRole('button', { name: 'Send tilbakemelding' }).click(),
        ])

        const postData = JSON.parse(request.postData() || '{}')
        expect(postData).toMatchObject({
            feedbackId: 'arbeidssituasjon-annet',
            svar: 'ANNEN_ARSAK',
            feedback: 'Pensjonert, men jobber litt ved siden av',
        })

        await expect(modal.getByText('Takk for tilbakemeldingen!')).toBeVisible()
        await expect(modal.getByRole('button', { name: 'Lukk vindu' })).toBeVisible()
        await expect(modal.getByRole('button', { name: 'Avbryt' })).not.toBeVisible()
    })

    test('viser valideringsfeil på fritekst ved send med "Annen årsak" uten tekst', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const modal = page.getByRole('dialog')
        await modal.getByRole('radio', { name: 'Annen årsak' }).click()
        await modal.getByRole('button', { name: 'Send tilbakemelding' }).click()

        await expect(modal.getByText('Vennligst oppgi årsak.')).toBeVisible()
    })

    test('viser valideringsfeil ved send uten å velge årsak', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const modal = page.getByRole('dialog')
        await modal.getByRole('button', { name: 'Send tilbakemelding' }).click()

        await expect(modal.getByText('Du må velge en årsak.')).toBeVisible()
    })

    test('viser ikke survey-modal ved direktenavigasjon til kvittering', async ({ page }) => {
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        const kvitteringUrl = page.url().replace(/\?.*/, '')
        await page.goto(kvitteringUrl)

        await expect(page.getByRole('dialog')).not.toBeVisible()
    })

    test.skip('viser ikke survey-modal på kvittering når toggle er av', async ({ page }) => {
        await page.goto(page.url().replace(/\?.*/, '') + '?toggle_flexjar-arbeidssituasjon-annet-survey=false')
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        await expect(page.getByRole('dialog')).not.toBeVisible()
    })
})
